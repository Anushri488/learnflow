/**
 * storage.js
 * Thin wrapper around localStorage with JSON serialisation.
 * All keys are namespaced under "lf_" to avoid collisions.
 */

const Storage = (() => {
  const NS = 'lf_';

  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(NS + key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(NS + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function remove(key) {
    try { localStorage.removeItem(NS + key); } catch {}
  }

  function clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(NS))
      .forEach(k => localStorage.removeItem(k));
  }

  return { get, set, remove, clear };
})();

// ── Reactive state backed by localStorage ──────────────────
const State = {
  enrolled:      Storage.get('enrolled', {}),   // { courseId: true }
  progress:      Storage.get('progress', {}),   // { lessonId: true }
  quizHistory:   Storage.get('quizHistory', []),// [ {courseId, lessonId, score, total, pct, date} ]
  xp:            Storage.get('xp', 0),

  save() {
    Storage.set('enrolled',    this.enrolled);
    Storage.set('progress',    this.progress);
    Storage.set('quizHistory', this.quizHistory);
    Storage.set('xp',          this.xp);
  },

  enroll(courseId) {
    if (this.enrolled[courseId]) return false;
    this.enrolled[courseId] = true;
    this.addXP(50);
    this.save();
    return true;
  },

  completeLesson(lessonId) {
    if (this.progress[lessonId]) return false;
    this.progress[lessonId] = true;
    this.addXP(30);
    this.save();
    return true;
  },

  saveQuiz(courseId, lessonId, score, total) {
    const pct = Math.round((score / total) * 100);
    this.quizHistory.push({
      courseId, lessonId, score, total, pct,
      date: new Date().toLocaleDateString('en-IN')
    });
    this.addXP(Math.round(pct * 0.5));
    this.save();
    return pct;
  },

  addXP(amount) {
    this.xp += amount;
    this.save();
    // Dispatch event so Nav can update instantly
    window.dispatchEvent(new CustomEvent('xp-updated', { detail: this.xp }));
  },

  courseProgress(course) {
    const done = course.lessons.filter(id => this.progress[id]).length;
    return { done, total: course.lessons.length, pct: Math.round((done / course.lessons.length) * 100) };
  },

  isEnrolled(courseId) { return !!this.enrolled[courseId]; },
  isLessonDone(lessonId) { return !!this.progress[lessonId]; },
};
