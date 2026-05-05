import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmail = () => {
    if (!email.includes('@') || !email.includes('.')) {
      setError('Email noto\'g\'ri formatda!'); return
    }
    setError('')
    setStep(2)
  }

  const handleLogin = async () => {
    if (!password) {
      setError('Parolni kiriting!'); return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Xatolik yuz berdi')
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      setError("Server bilan bog'lanishda xatolik!")
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      step === 1 ? handleEmail() : handleLogin()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">💰</span>
          <h1 className="text-2xl font-extrabold text-gray-800 mt-2">
            Finance<span className="text-blue-600">Tracker</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Hisobingizga kiring</p>
        </div>

        {/* Step 1 - Email */}
        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 mt-1"
                placeholder="example@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              onClick={handleEmail}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl py-2.5 transition-colors text-sm"
            >
              Davom etish →
            </button>
          </div>
        )}

        {/* Step 2 - Password */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl px-4 py-2.5 flex justify-between items-center">
              <span className="text-sm text-gray-600">{email}</span>
              <button
                onClick={() => { setStep(1); setError('') }}
                className="text-xs text-blue-500 hover:underline"
              >
                O'zgartirish
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Parol</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 mt-1"
                type="password"
                placeholder="Parolni kiriting"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-xl py-2.5 transition-colors text-sm"
            >
              {loading ? 'Yuklanmoqda...' : 'Kirish'}
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Hisobingiz yo'qmi?{' '}
          <a href="/register" className="text-blue-500 hover:underline font-medium">
            Ro'yxatdan o'ting
          </a>
        </p>

      </div>
    </div>
  )
}

export default Login