/**
 * app.js
 * Entry point — runs after DOM is ready.
 * Loads data, registers routes, initialises UI, boots the app.
 */

document.addEventListener('DOMContentLoaded', async () => {

  // 1. Load JSON data
  await Data.init();

  // 2. Register page handlers with the Router
  Router.register('home',      () => HomePage.render());
  Router.register('courses',   () => CoursesPage.render());
  Router.register('dashboard', () => Dashboard.render());
  // detail / lesson / quiz pages are opened imperatively by their modules

  // 3. Initialise shared UI
  NotifPanel.init();
  initNavXP();

  // 4. Wire up nav links
  document.getElementById('nav-home').addEventListener('click', function () {
    Router.go('home', this);
  });
  document.getElementById('nav-courses').addEventListener('click', function () {
    Router.go('courses', this);
  });
  document.getElementById('nav-dashboard').addEventListener('click', function () {
    Router.go('dashboard', this);
  });

  // 5. Wire up search / filter inputs
  document.getElementById('search-input')?.addEventListener('input',  CoursesPage.filterAndRender);
  document.getElementById('filter-category')?.addEventListener('change', CoursesPage.filterAndRender);
  document.getElementById('filter-level')?.addEventListener('change',    CoursesPage.filterAndRender);
  document.getElementById('filter-sort')?.addEventListener('change',     CoursesPage.filterAndRender);

  // 6. Wire up notification panel
  document.getElementById('notif-btn').addEventListener('click', NotifPanel.toggle);
  document.getElementById('notif-mark-read').addEventListener('click', NotifPanel.markAllRead);

  // 7. Wire up lesson page buttons
  document.getElementById('play-btn').addEventListener('click',          LessonPage.play);
  document.getElementById('mark-complete-btn').addEventListener('click', LessonPage.markComplete);
  document.getElementById('prev-btn').addEventListener('click',          LessonPage.prev);
  document.getElementById('next-btn').addEventListener('click',          LessonPage.next);
  document.getElementById('lesson-back').addEventListener('click',       LessonPage.backToDetail);
  document.getElementById('open-quiz-btn').addEventListener('click',     QuizPage.open);

  // 8. Wire up quiz page buttons
  document.getElementById('quiz-submit-btn').addEventListener('click', QuizPage.submit);
  document.getElementById('quiz-next-btn').addEventListener('click',   QuizPage.next);
  document.getElementById('quiz-retake-btn').addEventListener('click', QuizPage.retake);
  document.getElementById('quiz-back-btn').addEventListener('click',   () => {
    Router.go('lesson');
  });
  document.getElementById('quiz-dash-btn').addEventListener('click', () => {
    Router.go('dashboard', document.getElementById('nav-dashboard'));
  });

  // 9. Wire up detail page back breadcrumb
  document.getElementById('detail-back').addEventListener('click', () => {
    Router.go('courses', document.getElementById('nav-courses'));
  });

  // 10. Boot on Home page
  Router.go('home', document.getElementById('nav-home'));
});
