import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [step, setStep] = useState(1) // 1=email, 2=username+password
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmail = () => {
    if (!form.email.includes('@') || !form.email.includes('.')) {
      setError("Email noto'g'ri formatda!"); return
    }
    setError('')
    setStep(2)
  }

 const handleRegister = async () => {
    if (!form.username || !form.password || !form.confirm) {
      setError("Barcha maydonlarni to'ldiring!"); return
    }
    if (form.password !== form.confirm) {
      setError("Parollar mos kelmadi!"); return
    }
    if (form.password.length < 6) {
      setError("Parol kamida 6 ta belgi bo'lishi kerak!"); return
    }
    setLoading(true)
    setError('')
    try {
      // 1. Register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Xatolik yuz berdi')
        setLoading(false)
        return
      }

      // 2. Avtomatik login
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      })
      const loginData = await loginRes.json()
      localStorage.setItem('token', loginData.token)
      localStorage.setItem('user', JSON.stringify(loginData.user))
      navigate('/dashboard')

    } catch (err) {
      setError("Server bilan bog'lanishda xatolik!")
      setLoading(false)
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
          <p className="text-gray-400 text-sm mt-1">Yangi hisob yarating</p>
        </div>

        {/* Step 1 - Email */}
        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 mt-1"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={ e => { if (e.key === 'Enter') handleEmail() } }
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

        {/* Step 2 - Username + Password */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl px-4 py-2.5 flex justify-between items-center">
              <span className="text-sm text-gray-600">{form.email}</span>
              <button
                onClick={() => { setStep(1); setError('') }}
                className="text-xs text-blue-500 hover:underline"
              >
                O'zgartirish
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Username</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 mt-1"
                placeholder="Ismingiz"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                onKeyDown={ e => { if (e.key === 'Enter') handleRegister() } }
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Parol</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 mt-1"
                type="password"
                placeholder="Kamida 6 ta belgi"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={ e => { if (e.key === 'Enter') handleRegister() } }
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Parolni tasdiqlang</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 mt-1"
                type="password"
                placeholder="Parolni qayta kiriting"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                onKeyDown={ e => { if (e.key === 'Enter') handleRegister() } }
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-xl py-2.5 transition-colors text-sm"
            >
              {loading ? 'Yuklanmoqda...' : "Ro'yxatdan o'tish"}
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Hisobingiz bormi?{' '}
          <a href="/login" className="text-blue-500 hover:underline font-medium">
            Kirish
          </a>
        </p>

      </div>
    </div>
  )
}

export default Register