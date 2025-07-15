"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      toast.success('로그인 성공!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || '로그인 실패')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        name,
        language: 'KOREAN',
        level: 'BEGINNER'
      })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      toast.success('회원가입 성공!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || '회원가입 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 shadow-sm backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">AI Education Platform</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-semibold transition"
              >
                로그인
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-lg hover:scale-105 transition"
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <div className="py-16">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6 animate-fade-in-up">
            AI 교육의 새로운 패러다임
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg md:text-2xl text-blue-100/90 mb-8 animate-fade-in-up delay-100">
            다국어 지원 AI 교육 플랫폼으로 언제 어디서나 효율적으로 학습하세요.<br/>
            인공지능, 머신러닝, 딥러닝을 4개 언어로 배워보세요.
          </p>
          <button
            onClick={() => setShowRegister(true)}
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition animate-fade-in-up delay-200"
          >
            무료로 시작하기
          </button>
        </div>

        {/* Features Section */}
        <div className="py-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card */}
            {[
              {
                icon: '🌍',
                title: '다국어 지원',
                desc: '한국어, 영어, 일본어, 중국어 4개 언어로 콘텐츠 제공'
              },
              {
                icon: '📚',
                title: '일일 학습',
                desc: '매일 3개의 새로운 AI 교육 콘텐츠'
              },
              {
                icon: '📈',
                title: '진도 추적',
                desc: '학습 진행률을 시각적으로 확인'
              },
              {
                icon: '👥',
                title: '커뮤니티',
                desc: '질문/답변, 스터디 그룹, 랭킹'
              },
              {
                icon: '📝',
                title: '단어장 & 노트',
                desc: '모르는 단어 저장, 개인 학습 노트'
              },
              {
                icon: '🛠️',
                title: '관리자 대시보드',
                desc: '콘텐츠 관리, 사용자 분석, 통계'
              }
            ].map((f, i) => (
              <div key={f.title} className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition animate-fade-in-up delay-300">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h4>
                <p className="text-gray-600 text-base">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 py-6 mt-12 shadow-inner backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © 2025 AI Education Platform. All rights reserved.
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">로그인</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                required
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-60"
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">회원가입</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                required
              />
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                required
              />
              <input
                type="password"
                placeholder="비밀번호 (6자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-60"
              >
                {loading ? '회원가입 중...' : '회원가입'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 애니메이션 효과 */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease both;
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
} 