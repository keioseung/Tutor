import React, { ReactNode, useState, useEffect } from 'react';
import Navbar from './Navbar';
import ThemeToggle from './ThemeToggle';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') setTheme(saved);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${theme === 'dark' ? 'from-[#232526] via-[#414345] to-[#000000]' : 'from-[#f8fafc] via-[#e0e7ef] to-[#cfd9df]'} transition-colors duration-500`}>
      <Navbar theme={theme} />
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {children}
      </div>
      <footer className="w-full py-6 text-center text-xs text-gray-400 dark:text-gray-600 bg-transparent">
        © 2025 AI Education Platform. Inspired by NVIDIA, Apple, Google.
        <div className="absolute right-6 top-6"><ThemeToggle theme={theme} setTheme={setTheme} /></div>
      </footer>
    </div>
  );
};

export default MainLayout; 