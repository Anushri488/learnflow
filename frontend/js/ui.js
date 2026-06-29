/**
 * ui.js
 * Shared UI utilities:
 *   - Page router
 *   - Toast notifications
 *   - Notification panel
 *   - Nav XP updater
 */

// ── ROUTER ────────────────────────────────────────────────
const Router = (() => {
  const handlers = {};  // pageId → callback

  function register(pageId, fn) { handlers[pageId] = fn; }

  function go(pageId, activeLinkEl = null) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Deactivate all nav links
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));

    const page = document.getElementById('page-' + pageId);
    if (!page) { console.warn('Router: unknown page', pageId); return; }
    page.classList.add('active');

    if (activeLinkEl) activeLinkEl.classList.add('active');

    // Run page-specific init if registered
    if (handlers[pageId]) handlers[pageId]();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    NotifPanel.close();
  }

  return { go, register };
})();


// ── TOAST ──────────────────────────────────────────────────
const Toast = (() => {
  let container;

  function getContainer() {
    if (!container) {
      container = document.getElementById('toast-container');
    }
    return container;
  }

  /**
   * @param {'success'|'info'|'warn'} type
   * @param {string} message
   * @param {number} duration  ms before auto-dismiss
   */
  function show(type, message, duration = 3500) {
    const icons = { success: '✅', info: 'ℹ️', warn: '⚠️' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    getContainer().appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  return { show };
})();


// ── NOTIFICATION PANEL ─────────────────────────────────────
const NotifPanel = (() => {
  let panel, dot, unreadCount = 2; // start with 2 unread

  function init() {
    panel = document.getElementById('notif-panel');
    dot   = document.getElementById('notif-dot');

    // Close when clicking outside
    document.addEventListener('click', e => {
      if (!e.target.closest('#notif-panel') && !e.target.closest('#notif-btn')) close();
    });
  }

  function toggle() {
    if (!panel) return;
    panel.classList.toggle('open');
  }

  function close() {
    panel && panel.classList.remove('open');
  }

  function markAllRead() {
    document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
    if (dot) dot.style.display = 'none';
    unreadCount = 0;
    Toast.show('info', '✓ All notifications marked as read');
  }

  return { init, toggle, close, markAllRead };
})();


// ── NAV XP ─────────────────────────────────────────────────
function initNavXP() {
  const xpEl    = document.getElementById('nav-xp');
  const levelEl = document.getElementById('nav-level');

  function update(xp) {
    if (xpEl)    xpEl.textContent = `⚡ ${xp.toLocaleString('en-IN')} XP`;
    if (levelEl) levelEl.textContent = `Lv.${Math.floor(xp / 500) + 1}`;
  }

  // Initial render
  update(State.xp);

  // Listen for xp-updated events from State
  window.addEventListener('xp-updated', e => update(e.detail));
}


// ── UTILS ──────────────────────────────────────────────────
function levelClass(level) {
  return level === 'Beginner' ? 'level-beginner'
       : level === 'Intermediate' ? 'level-intermediate'
       : 'level-advanced';
}

function progressBarHTML(pct, color = null) {
  const style = color ? `background:linear-gradient(90deg,${color},${color}88)` : '';
  return `
    <div class="progress-bar">
      <div class="progress-fill" style="width:${pct}%;${style}"></div>
    </div>`;
}
