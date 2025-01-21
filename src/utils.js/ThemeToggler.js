import { useState, useLayoutEffect } from 'react';

const ThemeToggler = () => {
  const [theme, setTheme] = useState('dark');

  // Load theme from localStorage before rendering
  useLayoutEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(storedTheme);
  }, []);

  // Update theme in localStorage and HTML class
  useLayoutEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Toggle light/dark mode
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center bg-gray-200 dark:bg-gray-600 p-2 rounded-full transition"
    >
      {theme === 'light' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6 text-orange-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121m0 8.486l2.121 2.121M6.343 6.343l2.121 2.121m0 8.486l-2.121 2.121"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6 text-yellow-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.89 0 1.754-.132 2.56-.384A8.978 8.978 0 0112 21c-4.97 0-9-4.03-9-9s4.03-9 9-9c.89 0 1.754.132 2.56.384A8.978 8.978 0 0112 3z"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggler;
