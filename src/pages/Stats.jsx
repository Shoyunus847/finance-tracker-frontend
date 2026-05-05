import React, { useState, useEffect } from 'react'
import { getTransactions, addTransaction, deleteTransaction } from '../api/transactions'
import api from '../api/axios'

function Stats() {
  const [transactions, setTransactions] = useState([])
  const [form, setForm] = useState({ title: '', amount: '', type: 'expense', description: '' })
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', amount: '', type: '', description: '' })

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions()
      setTransactions(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleAdd = async () => {
    if (!form.title || !form.amount) {
      setError(true); return
    }
    setError(false)
    try {
      await addTransaction(form)
      setForm({ title: '', amount: '', type: 'expense', description: '' })
      fetchTransactions()
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id)
      fetchTransactions()
    } catch (err) {
      console.log(err)
    }
  }

  const handleEditStart = (t) => {
    setEditId(t._id)
    setEditForm({ title: t.title, amount: t.amount, type: t.type, description: t.description || '' })
  }

  const handleEditSave = async (id) => {
    try {
      await api.put('/transactions/' + id, {
        title: editForm.title,
        amount: Number(editForm.amount),
        type: editForm.type,
        description: editForm.description
      })
      setEditId(null)
      fetchTransactions()
    } catch (err) {
      console.log(err)
    }
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  const balance = totalIncome - totalExpense

  if (loading) return <div className="p-6 text-center text-gray-400">Yuklanmoqda...</div>

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Balans kartochkalari */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-xs font-medium uppercase">Umumiy Daromad</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">+${totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-xs font-medium uppercase">Umumiy Xarajat</p>
            <p className="text-2xl font-bold text-red-500 mt-1">-${totalExpense.toLocaleString()}</p>
          </div>
          <div className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-100">
            <p className="text-blue-100 text-xs font-medium uppercase">Joriy Balans</p>
            <p className="text-2xl font-bold text-white mt-1">${balance.toLocaleString()}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Yangi tranzaksiya</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Nomi (masalan: Somsa yedi)"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              type="number"
              placeholder="Summa"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
            <select
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">📉 Xarajat (minus)</option>
              <option value="income">📈 Daromad (plus)</option>
            </select>
            <textarea
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 md:col-span-3 resize-none"
              placeholder="Izoh (ixtiyoriy) — masalan: Tushlik uchun bozordan somsa oldim"
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-2">Nomi va summani kiriting!</p>}
          <button
            onClick={handleAdd}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
          >
            + Qo'shish
          </button>
        </div>

        {/* Jadval */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Barcha tranzaksiyalar</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs">
                <th className="text-left py-2 px-2">Nomi</th>
                <th className="text-left py-2 px-2">Izoh</th>
                <th className="text-right py-2 px-2">Summa</th>
                <th className="text-right py-2 px-2">Turi</th>
                <th className="text-right py-2 px-2">Sana</th>
                <th className="text-right py-2 px-2">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b border-gray-50">
                  {editId === t._id ? (
                    <>
                      <td className="py-2 px-2">
                        <input
                          className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none w-full"
                          value={editForm.title}
                          onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none w-full"
                          placeholder="Izoh"
                          value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none w-full text-right"
                          type="number"
                          value={editForm.amount}
                          onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                        />
                      </td>
                      <td className="py-2 px-2">
                        <select
                          className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none w-full"
                          value={editForm.type}
                          onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                        >
                          <option value="expense">📉 Xarajat</option>
                          <option value="income">📈 Daromad</option>
                        </select>
                      </td>
                      <td className="py-2 px-2 text-right text-gray-400 text-xs">
                        {new Date(t.date).toLocaleDateString('uz-UZ')}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <button onClick={() => handleEditSave(t._id)} className="text-xs text-emerald-500 hover:text-emerald-700 mr-2">
                          Saqlash
                        </button>
                        <button onClick={() => setEditId(null)} className="text-xs text-gray-400 hover:text-gray-600">
                          Bekor
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2.5 px-2 font-medium">{t.title}</td>
                      <td className="py-2.5 px-2 text-gray-400 text-xs max-w-xs">
                        {t.description || <span className="text-gray-300">—</span>}
                      </td>
                      <td className={`py-2.5 px-2 text-right font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                          {t.type === 'income' ? '📈 Daromad' : '📉 Xarajat'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right text-gray-400 text-xs">
                        {new Date(t.date).toLocaleDateString('uz-UZ')}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <button onClick={() => handleEditStart(t)} className="text-xs text-blue-400 hover:text-blue-600 mr-2">
                          Tahrirlash
                        </button>
                        <button onClick={() => handleDelete(t._id)} className="text-xs text-gray-400 hover:text-red-500">
                          O'chirish
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-6">Tranzaksiyalar yo'q</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Stats