import React, { useState, useEffect } from 'react'
import { getTransactions, getStats } from '../api/transactions'

function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [stats, setStats] = useState({ income: 0, expense: 0 })
  const [loading, setLoading] = useState(true)
  const [goal, setGoal] = useState(() => Number(localStorage.getItem('savings_goal')) || 1000000)
  const [editGoal, setEditGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, statsRes] = await Promise.all([
          getTransactions(),
          getStats()
        ])
        setTransactions(txRes.data)
        const incomeObj = statsRes.data.find(s => s._id === 'income')
        const expenseObj = statsRes.data.find(s => s._id === 'expense')
        setStats({
          income: incomeObj?.total || 0,
          expense: expenseObj?.total || 0
        })
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalBalance = stats.income - stats.expense
  const savingsRate = stats.income > 0 ? ((totalBalance / stats.income) * 100).toFixed(1) : 0
  const goalProgress = Math.min((totalBalance / goal) * 100, 100).toFixed(0)

  const biggestExpense = transactions
    .filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0]

  const biggestIncome = transactions
    .filter(t => t.type === 'income')
    .sort((a, b) => b.amount - a.amount)[0]

  const saveGoal = () => {
    const val = Number(goalInput)
    if (val > 0) {
      setGoal(val)
      localStorage.setItem('savings_goal', val)
    }
    setEditGoal(false)
  }

  if (loading) return <div className="p-6 text-center text-gray-400">Yuklanmoqda...</div>

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">👋 Xush kelibsiz!</h1>
            <p className="text-gray-400 mt-1 text-sm">Sizning moliyaviy holatingiz tahlili</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tejamkorlik</p>
            <p className="text-xl font-bold text-blue-600">{savingsRate}%</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-xs font-medium uppercase">Umumiy Daromad</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">+{stats.income.toLocaleString()} so'm</p>
            <p className="text-xs text-gray-400 mt-1">{transactions.filter(t => t.type === 'income').length} ta tranzaksiya</p>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-xs font-medium uppercase">Umumiy Xarajat</p>
            <p className="text-2xl font-bold text-red-500 mt-1">-{stats.expense.toLocaleString()} so'm</p>
            <p className="text-xs text-gray-400 mt-1">{transactions.filter(t => t.type === 'expense').length} ta tranzaksiya</p>
          </div>
          <div className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-100">
            <p className="text-blue-100 text-xs font-medium uppercase">Joriy Balans</p>
            <p className="text-2xl font-bold text-white mt-1">{totalBalance.toLocaleString()} so'm</p>
            <p className="text-xs text-blue-200 mt-1">Jami {transactions.length} ta tranzaksiya</p>
          </div>
        </div>

        {/* Oxirgi tranzaksiyalar + Eng katta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Oxirgi 5 tranzaksiya */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Oxirgi tranzaksiyalar</h2>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((t, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t.title}</p>
                    <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString('uz-UZ')}</p>
                  </div>
                  <p className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} so'm
                  </p>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-gray-400 text-sm text-center">Tranzaksiyalar yo'q</p>
              )}
            </div>
          </div>

          {/* Rekordlar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Rekordlar 🏆</h2>
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-xs text-emerald-600 font-medium uppercase mb-1">Eng katta daromad</p>
                {biggestIncome ? (
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">{biggestIncome.title}</p>
                    <p className="text-lg font-bold text-emerald-600">+{biggestIncome.amount.toLocaleString()} so'm</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Ma'lumot yo'q</p>
                )}
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs text-red-500 font-medium uppercase mb-1">Eng katta xarajat</p>
                {biggestExpense ? (
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">{biggestExpense.title}</p>
                    <p className="text-lg font-bold text-red-500">-{biggestExpense.amount.toLocaleString()} so'm</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Ma'lumot yo'q</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tejamkorlik maqsadi + Maslahat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Maqsad */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-800">Tejamkorlik maqsadi 🎯</h2>
              <button
                onClick={() => { setEditGoal(true); setGoalInput(goal) }}
                className="text-xs text-blue-500 hover:underline"
              >
                O'zgartirish
              </button>
            </div>
            {editGoal && (
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 flex-1"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  placeholder="Maqsad summasi (so'm)"
                />
                <button onClick={saveGoal} className="bg-blue-600 text-white text-sm rounded-xl px-4 py-2">
                  Saqlash
                </button>
              </div>
            )}
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-500">Joriy balans</span>
              <span className="font-bold text-gray-800">{totalBalance.toLocaleString()} / {goal.toLocaleString()} so'm</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${Number(goalProgress) >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {Number(goalProgress) >= 100 ? '🎉 Maqsadga yetdingiz!' : `Maqsadning ${goalProgress}% ga yetdingiz`}
            </p>
          </div>

          {/* Maslahat */}
          <div className=" from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg">Aqlli maslahat 💡</h3>
              <p className="text-indigo-100 text-sm mt-2">
                {totalBalance > 0
                  ? `Sizda ${totalBalance.toLocaleString()} so'm ijobiy balans bor! Mablag'ingizning 20% qismini investitsiyaga yo'naltirishни ko'rib chiqing.`
                  : "Xarajatlaringiz daromaddan oshib ketmoqda. Keraksiz xarajatlarni kamaytiring!"}
              </p>
              {transactions.length > 0 && (
                <p className="text-indigo-200 text-xs mt-3">
                  📊 Jami {transactions.length} ta tranzaksiya qayd etilgan
                </p>
              )}
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-20 text-8xl">💰</div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Dashboard