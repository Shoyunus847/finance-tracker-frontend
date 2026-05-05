import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Stats from './pages/Stats'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './pages/Loyout'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stats" element={<Stats />} />
      </Route>
    </Routes>
  )
}

export default App