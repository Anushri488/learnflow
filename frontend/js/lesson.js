/**
 * lesson.js
 * Handles the Lesson View page:
 *   - Load lesson content
 *   - Simulated video player
 *   - Mark as complete
 *   - Prev / Next navigation
 *   - Sidebar lesson list
 */

const LessonPage = (() => {
  let _lessonId  = null;
  let _courseId  = null;
  let _videoInterval = null;

  // ── OPEN ──────────────────────────────────────────────────
  function open(lessonId, courseId) {
    if (!State.isEnrolled(courseId)) {
      Toast.show('info', '👆 Please enroll first to view lessons!');
      return;
    }

    _lessonId = lessonId;
    _courseId = courseId;

    const lesson = Data.getLesson(lessonId);
    const course = Data.getCourse(courseId);
    if (!lesson || !course) return;

    // Header
    document.getElementById('lesson-back').textContent   = `← ${course.title}`;
    document.getElementById('lesson-page-title').textContent = lesson.title;

    // Content
    document.getElementById('lesson-content').innerHTML  = lesson.content + `
      <div class="lesson-quiz-cta">
        <button class="btn btn-outline btn-sm" onclick="QuizPage.open()">
          📝 Take Quiz for this lesson
        </button>
      </div>`;

    // Reset video player
    _resetVideo();

    // Complete button
    _updateCompleteBtn(lessonId);

    // Progress bar in sidebar
    _updateProgressBar(course);

    // Sidebar lesson navigator
    _renderSidebarList(course, lessonId);

    // Prev / Next buttons
    const idx = course.lessons.indexOf(lessonId);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    prevBtn.disabled     = idx === 0;
    nextBtn.textContent  = idx === course.lessons.length - 1 ? 'Finish Course ✓' : 'Next →';

    Router.go('lesson');
  }

  // ── VIDEO PLAYER ──────────────────────────────────────────
  function _resetVideo() {
    clearInterval(_videoInterval);
    const hud = document.getElementById('video-hud');
    const bar = document.getElementById('video-bar');
    if (hud) hud.style.display = 'none';
    if (bar) bar.style.width   = '0%';

    // Show play button again
    const playBtn = document.getElementById('play-btn');
    if (playBtn) playBtn.style.display = 'flex';
  }

  function play() {
    const hud     = document.getElementById('video-hud');
    const bar     = document.getElementById('video-bar');
    const playBtn = document.getElementById('play-btn');

    if (hud)     hud.style.display = 'block';
    if (playBtn) playBtn.style.display = 'none';

    clearInterval(_videoInterval);
    let pct = 0;
    _videoInterval = setInterval(() => {
      pct += 1.5;
      if (bar) bar.style.width = Math.min(pct, 100) + '%';
      if (pct >= 100) {
        clearInterval(_videoInterval);
        Toast.show('success', '🎬 Video complete! Mark the lesson as done.');
      }
    }, 120);
  }

  // ── COMPLETE ──────────────────────────────────────────────
  function _updateCompleteBtn(lessonId) {
    const btn  = document.getElementById('mark-complete-btn');
    const done = State.isLessonDone(lessonId);
    btn.textContent = done ? '✓ Completed' : 'Mark as Complete ✓';
    btn.disabled    = done;
    btn.className   = `btn complete-btn ${done ? 'btn-outline' : 'btn-success'}`;
  }

  function markComplete() {
    const isNew = State.completeLesson(_lessonId);
    if (isNew) {
      Toast.show('success', '✅ Lesson complete! +30 XP');
    }
    _updateCompleteBtn(_lessonId);
    _updateProgressBar(Data.getCourse(_courseId));
    _renderSidebarList(Data.getCourse(_courseId), _lessonId);
  }

  // ── PROGRESS BAR ──────────────────────────────────────────
  function _updateProgressBar(course) {
    const { pct } = State.courseProgress(course);
    const pctEl   = document.getElementById('course-progress-pct');
    const barEl   = document.getElementById('course-progress-bar');
    if (pctEl) pctEl.textContent  = pct + '%';
    if (barEl) barEl.style.width  = pct + '%';
  }

  // ── SIDEBAR LESSON LIST ───────────────────────────────────
  function _renderSidebarList(course, activeLessonId) {
    const wrap = document.getElementById('sidebar-lessons');
    if (!wrap) return;
    wrap.innerHTML = course.lessons.map(lid => {
      const l      = Data.getLesson(lid);
      const done   = State.isLessonDone(lid);
      const active = lid === activeLessonId;
      return `
      <div class="lessons-nav-item ${active ? 'active' : ''}" onclick="LessonPage.open(${lid}, ${course.id})">
        <div class="nav-dot ${done ? 'done' : ''}">${done ? '✓' : ''}</div>
        <div class="nav-lesson-name">${l ? l.title : 'Lesson'}</div>
      </div>`;
    }).join('');
  }

  // ── NAV ───────────────────────────────────────────────────
  function prev() {
    const course = Data.getCourse(_courseId);
    const idx    = course.lessons.indexOf(_lessonId);
    if (idx > 0) open(course.lessons[idx - 1], _courseId);
  }

  function next() {
    const course = Data.getCourse(_courseId);
    const idx    = course.lessons.indexOf(_lessonId);
    if (idx < course.lessons.length - 1) {
      open(course.lessons[idx + 1], _courseId);
    } else {
      // Last lesson
      const allDone = course.lessons.every(l => State.isLessonDone(l));
      Toast.show(allDone ? 'success' : 'info',
        allDone ? '🎓 Course complete! Congratulations!' : '📌 Complete all lessons to finish the course!');
      if (allDone) {
        setTimeout(() => Router.go('dashboard'), 1200);
      }
    }
  }

  function backToDetail() {
    DetailPage.open(_courseId);
  }

  function getLessonId()  { return _lessonId; }
  function getCourseId()  { return _courseId; }

  return { open, play, markComplete, prev, next, backToDetail, getLessonId, getCourseId };
})();
