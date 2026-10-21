// Stored light/dark choice (localStorage "bt-theme"), applied to <html> before
// the first paint so there is no flash. Used by app/layout.js; the switch is
// components/chrome/ThemeToggle.jsx.
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("bt-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
