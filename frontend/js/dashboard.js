/**
 * dashboard.js
 * Renders the full Dashboard page:
 *   - Stat cards (enrolled, completed, lessons, XP)
 *   - Course progress bars
 *   - Data visualisation (bar + pie charts)
 *   - Quiz history table
 *   - Achievements grid
 *   - Activity feed
 *   - Badge system (Beginner / Achiever / Expert)
 *   - Continue learning cards
 */

const Dashboard = (() => {

  function render() {
    const enrolledIds    = Object.keys(State.enrolled).map(Number);
    const enrolledCourses = Data.getAllCourses().filter(c => enrolledIds.includes(c.id));
    const totalLessons   = Object.keys(State.progress).length;
    const completedCourses = enrolledCourses.filter(c =>
      c.lessons.every(l => State.isLessonDone(l))
    );
    const avgScore = State.quizHistory.length
      ? Math.round(State.quizHistory.reduce((s, q) => s + q.pct, 0) / State.quizHistory.length)
      : 0;

    document.getElementById('dash-content').innerHTML = `
      <!-- Top bar -->
      <div class="dash-topbar">
        <div class="section-title">My <span>Dashboard</span></div>
        <div class="dash-subtitle">Your learning journey at a glance</div>
        <div class="badge-system-row">
          ${_badgeSystemHTML(State.xp)}
        </div>
      </div>

      <!-- Stat cards -->
      <div class="dash-stats">
        ${_statCard('📚', enrolledIds.length,      'Courses Enrolled',   '↑ Keep going!')}
        ${_statCard('🎓', completedCourses.length, 'Courses Completed',  '')}
        ${_statCard('✅', totalLessons,            'Lessons Completed',  '')}
        ${_statCard('⚡', State.xp,               'Total XP Earned',    '')}
      </div>

      <!-- Row 1: progress + viz -->
      <div class="dash-row">
        <div class="dash-panel">
          <div class="panel-title">Course Progress</div>
          ${enrolledCourses.length
            ? enrolledCourses.map(_courseProgressItem).join('')
            : '<p style="color:var(--text3);font-size:14px">No courses enrolled yet.</p>'}
        </div>
        <div class="dash-panel">
          <div class="panel-title">Distribution</div>
          <div class="viz-grid">
            <div class="viz-card">
              <div class="viz-title">By Category</div>
              <div class="bar-group">${_categoryBars()}</div>
            </div>
            <div class="viz-card">
              <div class="viz-title">By Level</div>
              <div class="pie-mini">${_levelPie()}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 2: quiz history + achievements -->
      <div class="dash-row">
        <div class="dash-panel">
          <div class="panel-title">Quiz History</div>
          ${State.quizHistory.length ? _quizTable() : '<p style="color:var(--text3);font-size:14px">No quizzes taken yet.</p>'}
        </div>
        <div class="dash-panel">
          <div class="panel-title">Achievements</div>
          <div class="achievements-grid">
            ${_achievementsHTML(totalLessons, enrolledIds.length, avgScore)}
          </div>
        </div>
      </div>

      <!-- Row 3: activity feed (full width) -->
      <div class="dash-row-full dash-panel">
        <div class="panel-title">Recent Activity</div>
        ${_activityFeed(enrolledCourses)}
      </div>

      <!-- Continue learning -->
      ${enrolledCourses.length ? `
        <div style="margin-top:28px">
          <div class="section-head">
            <div class="section-title">Continue <span>Learning</span></div>
          </div>
          <div class="course-grid">
            ${enrolledCourses.slice(0, 3).map(CoursesPage.courseCardHTML).join('')}
          </div>
        </div>` : ''}
    `;
  }

  // ── STAT CARD ─────────────────────────────────────────────
  function _statCard(icon, num, label, change) {
    return `
    <div class="dash-stat-card">
      <div class="dash-stat-icon">${icon}</div>
      <div class="dash-stat-num">${Number(num).toLocaleString('en-IN')}</div>
      <div class="dash-stat-label">${label}</div>
      ${change ? `<div class="dash-stat-change">${change}</div>` : ''}
    </div>`;
  }

  // ── COURSE PROGRESS ITEM ──────────────────────────────────
  function _courseProgressItem(c) {
    const { pct } = State.courseProgress(c);
    return `
    <div class="cpi">
      <div class="cpi-head">
        <span class="cpi-name">${c.title}</span>
        <span class="cpi-pct">${pct}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${pct}%;background:linear-gradient(90deg,${c.color},${c.color}99)"></div>
      </div>
    </div>`;
  }

  // ── CATEGORY BAR CHART ────────────────────────────────────
  function _categoryBars() {
    const counts = {};
    Data.getAllCourses().forEach(c => { counts[c.category] = (counts[c.category] || 0) + 1; });
    const max = Math.max(...Object.values(counts));
    return Object.entries(counts).map(([cat, cnt]) => `
      <div class="bar-item">
        <div class="bar-info"><span>${cat}</span><span>${cnt}</span></div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${(cnt / max) * 100}%"></div>
        </div>
      </div>`).join('');
  }

  // ── LEVEL PIE ─────────────────────────────────────────────
  function _levelPie() {
    const COLORS = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444' };
    const counts = {};
    Data.getAllCourses().forEach(c => { counts[c.level] = (counts[c.level] || 0) + 1; });
    const total = Data.getAllCourses().length;
    return Object.entries(counts).map(([lv, cnt]) => `
      <div class="pie-row">
        <div class="pie-dot" style="background:${COLORS[lv]}"></div>
        <div class="pie-label">${lv}</div>
        <div class="pie-val" style="color:${COLORS[lv]}">${Math.round((cnt / total) * 100)}%</div>
      </div>`).join('');
  }

  // ── QUIZ TABLE ────────────────────────────────────────────
  function _quizTable() {
    const rows = [...State.quizHistory].reverse().slice(0, 8).map(q => {
      const c   = Data.getCourse(q.courseId);
      const l   = Data.getLesson(q.lessonId);
      const cls = q.pct >= 80 ? 'score-high' : q.pct >= 60 ? 'score-mid' : 'score-low';
      return `<tr>
        <td>${c ? c.title.split(' ').slice(0, 2).join(' ') : '—'}</td>
        <td style="color:var(--text2)">${l ? l.title : '—'}</td>
        <td><span class="score-pill ${cls}">${q.pct}%</span></td>
        <td style="color:var(--text3)">${q.date}</td>
      </tr>`;
    }).join('');
    return `
    <table class="quiz-table">
      <thead><tr><th>Course</th><th>Lesson</th><th>Score</th><th>Date</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  }

  // ── ACHIEVEMENTS ──────────────────────────────────────────
  function _achievementsHTML(totalLessons, totalEnrolled, avgScore) {
    const BADGES = [
      { icon:'🌱', name:'First Step',   level:'bronze', unlocked: totalLessons   >= 1  },
      { icon:'📚', name:'Bookworm',     level:'silver', unlocked: totalLessons   >= 5  },
      { icon:'🔥', name:'On Fire',      level:'gold',   unlocked: totalLessons   >= 10 },
      { icon:'⚡', name:'Fast Learner', level:'silver', unlocked: totalEnrolled  >= 3  },
      { icon:'🎯', name:'Sharp Aim',    level:'gold',   unlocked: avgScore       >= 80 },
      { icon:'🏆', name:'Champion',     level:'gold',   unlocked: State.quizHistory.some(q => q.pct === 100) },
    ];
    return BADGES.map(b => `
      <div class="achievement ${b.unlocked ? '' : 'locked'}" title="${b.unlocked ? 'Unlocked!' : 'Keep learning to unlock'}">
        <div class="achievement-icon">${b.icon}</div>
        <div class="achievement-name">${b.name}</div>
        <div class="achievement-level level-${b.level}">${b.level.charAt(0).toUpperCase() + b.level.slice(1)}</div>
      </div>`).join('');
  }

  // ── BADGE SYSTEM (top of dashboard) ──────────────────────
  function _badgeSystemHTML(xp) {
    if (!xp) return '<span style="font-size:13px;color:var(--text3)">Complete lessons and quizzes to earn badges!</span>';
    return [
      xp >= 100  ? '<span class="user-badge badge-beginner">🌱 Beginner</span>'  : '',
      xp >= 500  ? '<span class="user-badge badge-achiever">⚡ Achiever</span>'  : '',
      xp >= 1000 ? '<span class="user-badge badge-expert">🔥 Expert</span>'      : '',
    ].join('');
  }

  // ── ACTIVITY FEED ─────────────────────────────────────────
  function _activityFeed(enrolledCourses) {
    const items = [];

    // Completed lessons
    Object.keys(State.progress).slice(-4).reverse().forEach(lid => {
      const l = Data.getLesson(Number(lid));
      if (l) items.push({ icon: '✅', bg: 'rgba(16,185,129,0.15)', text: `Completed lesson <strong>${l.title}</strong>`, time: 'Recently' });
    });

    // Quiz results
    [...State.quizHistory].reverse().slice(0, 2).forEach(q => {
      items.push({ icon: '🎯', bg: 'rgba(99,102,241,0.15)', text: `Quiz score: <strong>${q.pct}%</strong>`, time: q.date });
    });

    // Enrollments
    enrolledCourses.slice(0, 2).forEach(c => {
      items.push({ icon: '📚', bg: 'rgba(245,158,11,0.15)', text: `Enrolled in <strong>${c.title}</strong>`, time: 'Recently' });
    });

    if (!items.length) {
      return '<p style="color:var(--text3);font-size:14px">No activity yet — start learning!</p>';
    }

    return items.slice(0, 6).map(a => `
      <div class="activity-item">
        <div class="activity-dot" style="background:${a.bg}">${a.icon}</div>
        <div>
          <div class="activity-body">${a.text}</div>
          <div class="activity-time">${a.time}</div>
        </div>
      </div>`).join('');
  }

  return { render };
})();
