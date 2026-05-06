import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email va parolni kiriting!");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Email yoki parol xato!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        
        {/* Logo qismi (Register bilan bir xil) */}
        <div className="text-center mb-8">
          <span className="text-4xl">💰</span>
          <h1 className="text-2xl font-extrabold text-gray-800 mt-2">
            Finance<span className="text-blue-600">Tracker</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Xush kelibsiz!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 mt-1 transition-all"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Parol</label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 mt-1 transition-all"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && <p className="text-red-500 text-xs animate-pulse">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-xl py-3 transition-all text-sm shadow-lg shadow-blue-100"
          >
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Hisobingiz yo'qmi?{' '}
          <a href="/register" className="text-blue-500 hover:underline font-medium">
            Ro'yxatdan o'tish
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;