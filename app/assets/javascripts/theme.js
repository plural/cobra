// Light/Dark mode toggle for Cobra (classic Rails surface)
function updateButtonLabels() {
  var theme = document.documentElement.getAttribute('data-theme') || 'light';
  var label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.setAttribute('title', label);
    btn.setAttribute('aria-label', label);
  }
}

/**
 * @param {string} theme
 */
function setTheme(theme) {
  localStorage.setItem('cobra-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  updateButtonLabels();
}

// Global function called directly by button's onclick="toggleTheme()"
function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}

// Set button labels on load
document.addEventListener('DOMContentLoaded', updateButtonLabels);
document.addEventListener('turbolinks:load', updateButtonLabels);

// Keep in sync with OS preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
  if (!localStorage.getItem('cobra-theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});
