import api from './axios'

export const getTransactions = () =>
  api.get('/transactions')

export const addTransaction = (data) =>
  api.post('/transactions', {
    title: data.title,
    amount: Number(data.amount),
    type: data.type,
    category: data.category || 'general',
    description: data.description || ''
  })

export const deleteTransaction = (id) =>
  api.delete('/transactions/' + id)

export const getStats = () =>
  api.get('/transactions/stats')