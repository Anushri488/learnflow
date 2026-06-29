/**
 * quiz.js
 * Full quiz engine:
 *   - Load questions for current lesson
 *   - Render question + options
 *   - Handle selection, submit, feedback
 *   - Show results screen
 *   - Retake support
 */

const QuizPage = (() => {
  let _questions   = [];
  let _currentIdx  = 0;
  let _answers     = [];     // { correct: bool, selected: number }
  let _answered    = false;
  let _selected    = null;

  // ── OPEN ──────────────────────────────────────────────────
  function open() {
    const lessonId = LessonPage.getLessonId();
    const lesson   = Data.getLesson(lessonId);
    if (!lesson) { Toast.show('warn', 'No lesson selected.'); return; }

    _questions  = [...Data.getQuiz(lesson.quiz)];
    _currentIdx = 0;
    _answers    = [];
    _answered   = false;
    _selected   = null;

    _showActive();
    Router.go('quiz');
    _renderQuestion();
  }

  // ── SHOW ACTIVE / RESULT PANELS ───────────────────────────
  function _showActive() {
    document.getElementById('quiz-active').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
  }

  function _showResult() {
    document.getElementById('quiz-active').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
  }

  // ── RENDER QUESTION ───────────────────────────────────────
  function _renderQuestion() {
    const q   = _questions[_currentIdx];
    const num = _currentIdx + 1;
    const tot = _questions.length;

    document.getElementById('quiz-counter').textContent      = `Question ${num} of ${tot}`;
    document.getElementById('quiz-question').textContent     = q.question;
    document.getElementById('quiz-prog-fill').style.width    = ((num - 1) / tot * 100) + '%';
    document.getElementById('quiz-feedback').style.display   = 'none';

    // Buttons
    const submitBtn = document.getElementById('quiz-submit-btn');
    const nextBtn   = document.getElementById('quiz-next-btn');
    submitBtn.style.display  = 'inline-flex';
    submitBtn.disabled       = true;
    nextBtn.style.display    = 'none';

    _selected = null;
    _answered = false;

    // Options
    document.getElementById('quiz-options').innerHTML = q.options.map((opt, i) => `
      <div class="quiz-option" id="opt-${i}" onclick="QuizPage.selectOption(${i})">
        <div class="option-radio"></div>
        <div class="option-text">${opt}</div>
      </div>`).join('');
  }

  // ── SELECT OPTION ─────────────────────────────────────────
  function selectOption(i) {
    if (_answered) return;
    _selected = i;
    document.querySelectorAll('.quiz-option').forEach((el, j) => {
      el.classList.toggle('selected', j === i);
    });
    document.getElementById('quiz-submit-btn').disabled = false;
  }

  // ── SUBMIT ────────────────────────────────────────────────
  function submit() {
    if (_selected === null || _answered) return;
    _answered = true;

    const q       = _questions[_currentIdx];
    const correct = _selected === q.answer;
    _answers.push({ correct, selected: _selected });

    // Style options
    document.querySelectorAll('.quiz-option').forEach((el, i) => {
      if (i === q.answer)                    el.classList.add('correct');
      else if (i === _selected && !correct)  el.classList.add('wrong');
    });

    // Feedback
    const fb = document.getElementById('quiz-feedback');
    fb.style.display = 'block';
    fb.className     = `quiz-feedback ${correct ? 'correct' : 'wrong'}`;
    fb.innerHTML     = `<strong>${correct ? '✓ Correct!' : '✗ Incorrect'}</strong> — ${q.explanation}`;

    // Swap buttons
    document.getElementById('quiz-submit-btn').style.display = 'none';
    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.style.display   = 'inline-flex';
    const isLast = _currentIdx === _questions.length - 1;
    nextBtn.textContent     = isLast ? 'See Results →' : 'Next →';
  }

  // ── NEXT QUESTION ─────────────────────────────────────────
  function next() {
    _currentIdx++;
    if (_currentIdx >= _questions.length) {
      _showResults();
    } else {
      _renderQuestion();
    }
  }

  // ── RESULTS ───────────────────────────────────────────────
  function _showResults() {
    const correct = _answers.filter(a => a.correct).length;
    const total   = _answers.length;
    const pct     = State.saveQuiz(
      LessonPage.getCourseId(),
      LessonPage.getLessonId(),
      correct, total
    );

    // Emoji + label
    let emoji, label;
    if      (pct >= 80) { emoji = '🏆'; label = 'Excellent! You really know this material.'; }
    else if (pct >= 60) { emoji = '👍'; label = "Good job! A little more review and you'll ace it."; }
    else                { emoji = '📖'; label = 'Keep studying — try again after reviewing the lesson.'; }

    document.getElementById('result-emoji').textContent      = emoji;
    document.getElementById('result-score').textContent      = pct + '%';
    document.getElementById('result-label').textContent      = label;
    document.getElementById('result-correct').textContent    = correct;
    document.getElementById('result-wrong').textContent      = total - correct;
    document.getElementById('result-total').textContent      = total;

    _showResult();
    Toast.show(pct >= 60 ? 'success' : 'info', `Quiz done! Score: ${pct}% · +${Math.round(pct * 0.5)} XP`);
  }

  // ── RETAKE ────────────────────────────────────────────────
  function retake() {
    _currentIdx = 0;
    _answers    = [];
    _selected   = null;
    _answered   = false;
    _showActive();
    _renderQuestion();
  }

  return { open, selectOption, submit, next, retake };
})();
