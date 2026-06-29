/**
 * home.js
 * Renders the Home page:
 *   - Hero section
 *   - "Continue Learning" enrolled course cards
 */

const HomePage = (() => {

  function render() {
    _renderContinue();
  }

  function _renderContinue() {
    const enrolledIds = Object.keys(State.enrolled).map(Number);
    const wrap = document.getElementById('continue-courses');
    if (!wrap) return;

    if (!enrolledIds.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <div class="icon">📚</div>
          <p>You haven't enrolled in any courses yet.</p>
          <br>
          <button class="btn btn-primary"
            onclick="Router.go('courses', document.querySelector('.nav-link:nth-child(2)'))">
            Browse Courses →
          </button>
        </div>`;
      return;
    }

    const enrolled = Data.getAllCourses().filter(c => enrolledIds.includes(c.id));
    wrap.innerHTML = `<div class="course-grid">${enrolled.map(CoursesPage.courseCardHTML).join('')}</div>`;
  }

  return { render };
})();
