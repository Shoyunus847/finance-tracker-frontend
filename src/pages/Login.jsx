import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Login() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmail = () => {
    if (!email.includes('@') || !email.includes('.')) {
      setError("Email noto'g'ri formatda!")
      return
    }
    setError('')
    setStep(2)
  }

  const handleLogin = async () => {
    if (!password) {
      setError("Parolni kiriting!")
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await api.post('/auth/login', {
        email,
        password
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || "Server xatolik!")
    } finally {
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
      <div className="bg-white p-8 rounded-2xl w-full max-w-sm">

        <h1 className="text-xl font-bold text-center mb-6">Login</h1>

        {step === 1 && (
          <>
            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button onClick={handleEmail} className="w-full bg-blue-600 text-white p-2 rounded mt-2">
              Davom etish
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              className="w-full border p-2 rounded mb-2"
              type="password"
              placeholder="Parol"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded mt-2"
            >
              {loading ? "Yuklanmoqda..." : "Kirish"}
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default Login