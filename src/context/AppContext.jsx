import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getCurrentMonth } from '../utils/format'
import * as db from '../lib/storage'

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
      const [txs, sum, gs, bs, cats] = await Promise.all([
        db.getTransactions(month),
        db.getSummary(month),
        db.getGoals(),
        db.getBudgets(),
        db.getCustomCategories(),
      ])
      setTransactions(txs)
      setSummary(sum)
      setGoals(gs)
      setBudgets(bs)
      setCustomCategories(cats)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll(selectedMonth) }, [selectedMonth, fetchAll])

  const addTransaction = async (data) => { await db.addTransaction(data); await fetchAll(selectedMonth) }
  const updateTransaction = async (id, data) => { await db.updateTransaction(id, data); await fetchAll(selectedMonth) }
  const deleteTransaction = async (id) => { await db.deleteTransaction(id); await fetchAll(selectedMonth) }

  const addGoal = async (data) => { await db.addGoal(data); setGoals(await db.getGoals()) }
  const updateGoalAmount = async (id, amount) => { await db.updateGoalAmount(id, amount); setGoals(await db.getGoals()) }
  const deleteGoal = async (id) => { await db.deleteGoal(id); setGoals(await db.getGoals()) }

  const addBudget = async (data) => { await db.addBudget(data); setBudgets(await db.getBudgets()) }
  const deleteBudget = async (id) => { await db.deleteBudget(id); setBudgets(await db.getBudgets()) }

  const addCustomCategory = async (data) => { await db.addCustomCategory(data); setCustomCategories(await db.getCustomCategories()) }
  const deleteCustomCategory = async (id) => { await db.deleteCustomCategory(id); setCustomCategories(await db.getCustomCategories()) }

  const exportCSV = () => {
    const headers = ['Fecha', 'Tipo', 'Categoría', 'Concepto', 'Monto']
    const rows = transactions.map(t => [t.date, t.type, t.category, `"${t.description}"`, t.amount])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `finanzas-${selectedMonth}.csv`; a.click()
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
      transactions, goals, budgets, customCategories, summary, loading,
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
