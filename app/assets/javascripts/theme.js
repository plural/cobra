// Dark mode toggle for Cobra (classic Rails surface)
// Reads/writes localStorage key 'cobra-theme'; applies data-theme to <html>.
// The initial theme is set by an inline script in application.html.slim
// to prevent flash-of-wrong-theme before stylesheets load.

(function () {
  'use strict';

  function setTheme(theme) {
    localStorage.setItem('cobra-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = localStorage.getItem('cobra-theme') || 'light';
        setTheme(current === 'light' ? 'dark' : 'light');
      });
    });
  });

  // Keep in sync when the user changes their OS preference,
  // but only if they have not explicitly set a preference in this app.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('cobra-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}());
