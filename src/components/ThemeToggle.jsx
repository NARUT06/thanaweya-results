export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'التبديل للوضع الفاتح' : 'التبديل للوضع الداكن'}
      className="fixed top-4 left-4 z-10 h-11 w-11 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-xl hover:scale-105 transition-transform"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
