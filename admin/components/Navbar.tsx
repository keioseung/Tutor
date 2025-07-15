import React from 'react';
import Link from 'next/link';

const Navbar: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  return (
    <nav className={`w-full z-20 sticky top-0 bg-white/80 dark:bg-[#181a1b]/80 shadow-md backdrop-blur-md transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight drop-shadow-md">AIedu</span>
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition">홈</Link>
          <Link href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition">대시보드</Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition">소개</Link>
        </div>
        <div className="flex space-x-2">
          <Link href="/" className="px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:scale-105 transition">로그인</Link>
          <Link href="/" className="px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md hover:scale-105 transition">회원가입</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 