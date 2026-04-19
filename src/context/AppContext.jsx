import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getCurrentMonth } from '../utils/format'

const AppContext = createContext()
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth)
  const [transactions, setTransactions] = useState([])
  const [goals, setGoals] = useState([])
  const [budgets, setBudgets] = useState([])
  const [customCategories, setCustomCategories] = useState([])
  const [summary, setSummary] = useState({ ingresos: 0, gastos: 0, ahorro: 0, byCategory: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const fetchAll = useCallback(async (month) => {
    setLoading(true)
    try {
      const [txRes, sumRes, goalsRes, budgetsRes, catsRes] = await Promise.all([
        fetch(`/api/transactions?month=${month}`),
        fetch(`/api/transactions/summary/${month}`),
        fetch('/api/goals'),
        fetch('/api/budgets'),
        fetch('/api/categories'),
      ])
      const [txData, sumData, goalsData, budgetsData, catsData] = await Promise.all([
        txRes.json(), sumRes.json(), goalsRes.json(), budgetsRes.json(), catsRes.json()
      ])
      setTransactions(txData)
      setSummary(sumData)
      setGoals(goalsData)
      setBudgets(budgetsData)
      setCustomCategories(catsData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll(selectedMonth) }, [selectedMonth, fetchAll])

  const addTransaction = async (data) => {
    await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    await fetchAll(selectedMonth)
  }

  const updateTransaction = async (id, data) => {
    await fetch(`/api/transactions/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    await fetchAll(selectedMonth)
  }

  const deleteTransaction = async (id) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    await fetchAll(selectedMonth)
  }

  const addGoal = async (data) => {
    await fetch('/api/goals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const res = await fetch('/api/goals')
    setGoals(await res.json())
  }

  const updateGoalAmount = async (id, amount) => {
    await fetch(`/api/goals/${id}/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount }) })
    const res = await fetch('/api/goals')
    setGoals(await res.json())
  }

  const deleteGoal = async (id) => {
    await fetch(`/api/goals/${id}`, { method: 'DELETE' })
    const res = await fetch('/api/goals')
    setGoals(await res.json())
  }

  const addBudget = async (data) => {
    await fetch('/api/budgets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const res = await fetch('/api/budgets')
    setBudgets(await res.json())
  }

  const deleteBudget = async (id) => {
    await fetch(`/api/budgets/${id}`, { method: 'DELETE' })
    const res = await fetch('/api/budgets')
    setBudgets(await res.json())
  }

  const addCustomCategory = async (data) => {
    await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const res = await fetch('/api/categories')
    setCustomCategories(await res.json())
  }

  const deleteCustomCategory = async (id) => {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    const res = await fetch('/api/categories')
    setCustomCategories(await res.json())
  }

  const exportCSV = () => {
    const headers = ['Fecha', 'Tipo', 'Categoría', 'Concepto', 'Monto']
    const rows = transactions.map(t => [t.date, t.type, t.category, `"${t.description}"`, t.amount])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finanzas-${selectedMonth}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getMascotaMood = () => {
    if (summary.ingresos === 0) return 'neutral'
    const pct = summary.ahorro / summary.ingresos
    if (pct < 0) return 'sad'
    if (pct >= 0.2) return 'crown'
    if (pct >= 0.1) return 'strong'
    return 'ok'
  }

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      selectedMonth, setSelectedMonth,
      transactions, goals, budgets, customCategories, summary,
      loading,
      addTransaction, updateTransaction, deleteTransaction,
      addGoal, updateGoalAmount, deleteGoal,
      addBudget, deleteBudget,
      addCustomCategory, deleteCustomCategory,
      exportCSV, getMascotaMood,
      refreshData: () => fetchAll(selectedMonth),
    }}>
      {children}
    </AppContext.Provider>
  )
}
