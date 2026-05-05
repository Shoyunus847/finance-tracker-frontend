import api from './axios'

export const register = (data) =>
  api.post('/auth/register', data)

export const login = async (data) => {
  const res = await api.post('/auth/login', data)
  localStorage.setItem('token', res.data.token)
  return res
}

export const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

export const isLoggedIn = () =>
  !!localStorage.getItem('token')