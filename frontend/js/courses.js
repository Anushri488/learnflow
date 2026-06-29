/**
 * courses.js
 * Handles:
 *   - Course listing page (search, filter, sort, render cards)
 *   - Course detail page (info, lesson list, enroll button)
 */

const CoursesPage = (() => {

  // ── LISTING ───────────────────────────────────────────────
  function render() {
    filterAndRender();
  }

  function filterAndRender() {
    const q    = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
    const cat  = document.getElementById('filter-category')?.value || '';
    const lev  = document.getElementById('filter-level')?.value || '';
    const sort = document.getElementById('filter-sort')?.value || 'popular';

    let list = Data.getAllCourses().filter(c => {
      const matchQ   = !q   || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
      const matchCat = !cat || c.category === cat;
      const matchLev = !lev || c.level === lev;
      return matchQ && matchCat && matchLev;
    });

    if (sort === 'duration') {
      list.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    } else if (sort === 'level') {
      const ORDER = { Beginner: 0, Intermediate: 1, Advanced: 2 };
      list.sort((a, b) => ORDER[a.level] - ORDER[b.level]);
    } else {
      // popular — sort by student count (strip "k")
      list.sort((a, b) => parseFloat(b.students) - parseFloat(a.students));
    }

    document.getElementById('course-count').textContent = `${list.length} course${list.length !== 1 ? 's' : ''}`;

    const grid = document.getElementById('course-grid');
    if (!list.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <div class="icon">🔍</div><p>No courses match your filters.</p>
      </div>`;
      return;
    }
    grid.innerHTML = list.map(courseCardHTML).join('');
  }

  // ── CARD HTML ─────────────────────────────────────────────
  function courseCardHTML(c) {
    const isEnrolled = State.isEnrolled(c.id);
    const { done, total, pct } = State.courseProgress(c);

    return `
    <div class="course-card" onclick="DetailPage.open(${c.id})">
      <div class="course-thumb" style="background:linear-gradient(135deg,${c.color}22,${c.color}44)">
        <span style="position:relative;z-index:1;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3))">${c.thumb}</span>
        <div class="course-thumb-overlay"></div>
        <div class="course-level ${levelClass(c.level)}">${c.level}</div>
      </div>
      <div class="course-body">
        <div class="course-category">${c.category}</div>
        <div class="course-title-card">${c.title}</div>
        <div class="course-desc">${c.description}</div>
        <div class="course-meta">
          <span>📚 ${total} lessons</span>
          <span>⏱️ ${c.duration}</span>
          <span>👥 ${c.students}</span>
        </div>
        ${isEnrolled ? `
          <div class="progress-wrap" style="margin-bottom:12px">
            <div class="progress-label"><span>Progress</span><span>${pct}%</span></div>
            ${progressBarHTML(pct, c.color)}
          </div>` : ''}
        <div class="course-footer">
          <div class="enrolled-badge">${isEnrolled ? '✓ Enrolled' : ''}</div>
          <button class="btn btn-primary btn-sm"
            onclick="event.stopPropagation(); DetailPage.open(${c.id})">
            ${isEnrolled ? 'Continue' : 'View Course'}
          </button>
        </div>
      </div>
    </div>`;
  }

  return { render, filterAndRender, courseCardHTML };
})();


// ── DETAIL PAGE ───────────────────────────────────────────
const DetailPage = (() => {
  let _courseId = null;

  function open(courseId) {
    _courseId = courseId;
    const c   = Data.getCourse(courseId);
    if (!c) return;

    // populate header
    document.getElementById('detail-category').textContent  = c.category;
    document.getElementById('detail-title').textContent     = c.title;
    document.getElementById('detail-desc').textContent      = c.description;
    document.getElementById('detail-tags').innerHTML        = c.tags.map(t => `<span class="tag">${t}</span>`).join('');
    document.getElementById('detail-lessons-count').textContent = c.lessons.length;
    document.getElementById('detail-duration').textContent  = c.duration;
    document.getElementById('detail-level').textContent     = c.level;
    document.getElementById('detail-students').textContent  = c.students + ' students';

    // cover emoji
    const cover = document.getElementById('detail-thumb');
    cover.textContent  = c.thumb;
    cover.style.fontSize = '72px';

    // enroll button
    _updateEnrollBtn(c);

    // lesson list
    _renderLessonList(c);

    Router.go('detail');
  }

  function _updateEnrollBtn(c) {
    const btn = document.getElementById('enroll-btn');
    const isEnrolled = State.isEnrolled(c.id);
    btn.textContent = isEnrolled ? '▶ Continue Learning' : 'Enroll Now';
    btn.onclick = isEnrolled
      ? () => LessonPage.open(c.lessons[0], c.id)
      : () => _enroll(c);
  }

  function _enroll(c) {
    const isNew = State.enroll(c.id);
    if (isNew) Toast.show('success', `🎉 Enrolled in "${c.title}"! +50 XP`);
    _updateEnrollBtn(c);
    _renderLessonList(c);
  }

  function _renderLessonList(c) {
    const isEnrolled = State.isEnrolled(c.id);
    document.getElementById('detail-lesson-list').innerHTML = c.lessons.map((lid, i) => {
      const l    = Data.getLesson(lid);
      const done = State.isLessonDone(lid);
      return `
      <div class="lesson-item ${done ? 'completed' : ''}" onclick="${isEnrolled ? `LessonPage.open(${lid}, ${c.id})` : 'DetailPage._promptEnroll()'}">
        <div class="lesson-num ${done ? 'done' : ''}">${done ? '✓' : i + 1}</div>
        <div class="lesson-info">
          <div class="lesson-name">${l ? l.title : 'Lesson ' + (i + 1)}</div>
          <div class="lesson-dur">⏱ ${l ? l.duration : ''}</div>
        </div>
        ${!isEnrolled ? '<div class="lesson-lock">🔒</div>' : ''}
      </div>`;
    }).join('');
  }

  function _promptEnroll() {
    Toast.show('info', '👆 Enroll first to access lessons!');
  }

  function getCourseId() { return _courseId; }

  return { open, getCourseId, _promptEnroll };
})();
