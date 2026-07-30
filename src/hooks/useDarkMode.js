import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme'; // القيمة المحفوظة: 'dark' أو 'light'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;

  // لو المستخدم مافيش عنده اختيار محفوظ، بنحترم إعداد نظام التشغيل بتاعه
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

/**
 * useDarkMode
 * ------------
 * بيدير الوضع الليلي للموقع كله: بيضيف/يشيل class="dark" على عنصر <html>،
 * وبيحفظ اختيار المستخدم في localStorage عشان يفضل متذكر لما يرجع تاني.
 */
export function useDarkMode() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return { theme, toggleTheme };
}
