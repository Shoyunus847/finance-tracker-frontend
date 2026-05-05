import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  // 1. Ma'lumotni olamiz va JSON parse qilamiz
  const storageUser = localStorage.getItem("user");
  
  // 2. Agar storageUser "undefined" yoki null bo'lsa, xato bermasligi uchun tekshiramiz
  const user = storageUser && storageUser !== "undefined" ? JSON.parse(storageUser) : null;

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path
    return `px-3 py-1.5 rounded-lg text-sm transition-colors ${
      isActive
        ? 'text-blue-600 bg-blue-50 font-semibold'
        : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100'
    }`
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="w-full bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/dashboard" className="flex items-center gap-2">
        <span className="text-2xl">💰</span>
        <h1 className="text-xl font-extrabold tracking-tight text-gray-800">
          Finance<span className="text-blue-600">Tracker</span>
        </h1>
      </Link>

      <nav className="flex items-center gap-2">
        <Link to="/dashboard" className={getLinkStyle('/dashboard')}>Dashboard</Link>
        <Link to="/stats" className={getLinkStyle('/stats')}>Stats</Link>
      </nav>

      <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
        <div className="text-right hidden sm:block">
          {/* 3. user mavjudligini tekshirib keyin username ni chiqaramiz */}
          <p className="text-sm font-medium text-gray-900 leading-none">
            {user?.username || "Mehmon"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Premium Plan</p>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
 
          {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
        </div>

        <button 
          onClick={handleLogout} 
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Chiqish
        </button>
      </div>
    </header>
  )
}

export default Header
