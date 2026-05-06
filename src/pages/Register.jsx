import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      setError("Barcha maydonlarni to'ldiring!")
      return
    }

    if (form.password !== form.confirm) {
      setError("Parollar mos emas!")
      return
    }

    setLoading(true)
    setError('')

    try {
      await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password
      })

      const loginRes = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      })

      localStorage.setItem('token', loginRes.data.token)
      localStorage.setItem('user', JSON.stringify(loginRes.data.user))

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-full max-w-sm">

        <input
          className="w-full border p-2 mb-2"
          placeholder="Username"
          onChange={e => setForm({ ...form, username: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-2"
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-2"
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-2"
          type="password"
          placeholder="Confirm"
          onChange={e => setForm({ ...form, confirm: e.target.value })}
        />

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Yuklanmoqda..." : "Register"}
        </button>

      </div>
    </div>
  )
}

export default Register