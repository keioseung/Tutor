import React, { useState } from 'react';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white dark:bg-[#181a1b] rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-lg font-bold ${mode === 'login' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setMode('login')}
          >
            로그인
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg font-bold ${mode === 'register' ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setMode('register')}
          >
            회원가입
          </button>
        </div>
        <form className="space-y-4">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white dark:bg-[#232526]"
              required
            />
          )}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white dark:bg-[#232526]"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white dark:bg-[#232526]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? (mode === 'login' ? '로그인 중...' : '회원가입 중...') : (mode === 'login' ? '로그인' : '회원가입')}
          </button>
        </form>
        <div className="mt-6 flex flex-col items-center">
          <span className="text-gray-400 text-xs mb-2">또는 소셜 계정으로 로그인</span>
          <div className="flex space-x-2">
            <button className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition">Google</button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition">Apple</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition">Naver</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 