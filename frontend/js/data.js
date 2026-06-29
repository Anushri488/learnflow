/**
 * data.js
 * Loads courses, lessons, and quizzes from JSON files.
 * Exposes a single `Data` object used by all page modules.
 */

const Data = (() => {
  let courses  = [];
  let lessons  = {};
  let quizzes  = {};
  let loaded   = false;

  async function init() {
    if (loaded) return;
    const [c, l, q] = await Promise.all([
      fetch('data/courses.json').then(r => r.json()),
      fetch('data/lessons.json').then(r => r.json()),
      fetch('data/quizzes.json').then(r => r.json()),
    ]);
    courses = c;
    lessons = l;
    quizzes = q;
    loaded  = true;
  }

  function getCourse(id)          { return courses.find(c => c.id === id) || null; }
  function getLesson(id)          { return lessons[id] || null; }
  function getQuiz(key)           { return quizzes[key] || []; }
  function getAllCourses()         { return courses; }

  return { init, getCourse, getLesson, getQuiz, getAllCourses };
})();
