import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { formatCurrency, getMonthLabel, getLast6Months } from '../utils/format'
import StatCard from '../components/StatCard'
import Monedita from '../components/Monedita'
import TransactionItem from '../components/TransactionItem'
import AddTransactionModal from '../components/AddTransactionModal'
import { GastosPieChart, IngresosGastosBar } from '../components/Charts'
import { FINANCIAL_TIPS } from '../utils/categories'

const MONTHS = getLast6Months()

export default function Dashboard() {
  const { summary, transactions, selectedMonth, setSelectedMonth, getMascotaMood, exportCSV, loading, customCategories } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState(null)
  const [historyData, setHistoryData] = useState([])
  const [tip] = useState(() => FINANCIAL_TIPS[Math.floor(Math.random() * FINANCIAL_TIPS.length)])

  useEffect(() => {
    const load = async () => {
      const results = await Promise.all(
        MONTHS.slice(0, 4).map(async m => {
          const res = await fetch(`/api/transactions/summary/${m}`)
          const d = await res.json()
          return { month: getMonthLabel(m), ingresos: d.ingresos, gastos: d.gastos }
        })
      )
      setHistoryData(results.reverse())
    }
    load()
  }, [transactions])

  const savingsPct = summary.ingresos > 0 ? Math.round((summary.ahorro / summary.ingresos) * 100) : 0
  const recentTx = transactions.slice(0, 5)

  const openAdd = () => { setEditingTx(null); setModalOpen(true) }
  const openEdit = (tx) => { setEditingTx(tx); setModalOpen(true) }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">Tu resumen financiero</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-sm input py-1.5 w-auto"
            value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {MONTHS.map(m => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
          </select>
          <button onClick={exportCSV}
            className="btn-ghost text-sm border border-gray-200 dark:border-gray-700 flex items-center gap-1.5">
            📥 <span className="hidden sm:inline">Exportar</span> CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Ingresos" value={formatCurrency(summary.ingresos)} color="text-green-500" icon="📈" />
        <StatCard label="Gastos" value={formatCurrency(summary.gastos)} color="text-red-500" icon="📉" />
        <StatCard label="Ahorro" value={formatCurrency(summary.ahorro)}
          color={summary.ahorro >= 0 ? 'text-blue-500' : 'text-red-500'} icon="💰" />
        <StatCard label="Meta total" value={`${savingsPct}%`}
          color={savingsPct >= 20 ? 'text-green-500' : savingsPct >= 10 ? 'text-yellow-500' : 'text-red-500'}
          icon="🎯" sub="objetivo: 20%" />
      </div>

      {/* Monedita */}
      <Monedita mood={getMascotaMood()} />

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold text-sm mb-3">Gastos por categoría</h2>
          <GastosPieChart data={summary.byCategory} customCategories={customCategories} />
        </div>
        <div className="card">
          <h2 className="font-semibold text-sm mb-3">Ingresos vs Gastos (últimos 4 meses)</h2>
          <IngresosGastosBar data={historyData} />
        </div>
      </div>

      {/* Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Últimos movimientos</h2>
          <button onClick={openAdd} className="btn-primary text-sm py-1.5 px-3">+ Agregar</button>
        </div>
        {loading ? (
          <p className="text-sm text-gray-400 py-6 text-center">Cargando...</p>
        ) : recentTx.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm text-gray-400">No hay movimientos este mes</p>
            <button onClick={openAdd} className="mt-3 text-sm text-green-500 font-medium hover:underline">
              Agregar el primero →
            </button>
          </div>
        ) : (
          recentTx.map(tx => <TransactionItem key={tx.id} transaction={tx} onEdit={openEdit} />)
        )}
      </div>

      {/* Tip */}
      <div className="card bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
        <p className="text-sm">
          <span className="mr-2">{tip.emoji}</span>
          <span className="font-semibold">Tip del día:</span> {tip.tip}
        </p>
      </div>

      <AddTransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} editingTransaction={editingTx} />

      {/* FAB */}
      <button onClick={openAdd}
        className="fixed bottom-20 md:bottom-6 right-4 w-14 h-14 bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-30 transition-all">
        +
      </button>
    </div>
  )
}
