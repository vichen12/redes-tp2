import { useState } from 'react'
import { useApp } from '../context/AppContext'
import TransactionItem from '../components/TransactionItem'
import AddTransactionModal from '../components/AddTransactionModal'
import { DEFAULT_CATEGORIES } from '../utils/categories'
import { formatCurrency, getMonthLabel, getLast6Months } from '../utils/format'

const MONTHS = getLast6Months()

export default function Transacciones() {
  const { transactions, summary, selectedMonth, setSelectedMonth, exportCSV, customCategories } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('todos')
  const [catFilter, setCatFilter] = useState('todas')

  const allCats = [
    ...DEFAULT_CATEGORIES.ingresos,
    ...DEFAULT_CATEGORIES.gastos,
    ...customCategories.map(c => ({ id: String(c.id), label: c.label, emoji: c.emoji }))
  ]

  const filtered = transactions.filter(tx => {
    if (typeFilter !== 'todos' && tx.type !== typeFilter) return false
    if (catFilter !== 'todas' && tx.category !== catFilter) return false
    if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openAdd = () => { setEditingTx(null); setModalOpen(true) }
  const openEdit = (tx) => { setEditingTx(tx); setModalOpen(true) }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold">Movimientos</h1>
          <p className="text-sm text-gray-500">
            {formatCurrency(summary.ingresos)} ingresos · {formatCurrency(summary.gastos)} gastos
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-ghost text-sm border border-gray-200 dark:border-gray-700">📥 CSV</button>
          <button onClick={openAdd} className="btn-primary text-sm">+ Agregar</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card space-y-3">
        <input type="text" placeholder="🔍 Buscar por concepto..."
          className="input" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="grid grid-cols-3 gap-2">
          <select className="input" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {MONTHS.map(m => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
          </select>
          <select className="input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
          <select className="input" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="todas">Todas las categorías</option>
            {allCats.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{filtered.length} movimiento{filtered.length !== 1 ? 's' : ''}</p>
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm text-gray-400">No hay resultados para ese filtro</p>
          </div>
        ) : (
          filtered.map(tx => <TransactionItem key={tx.id} transaction={tx} onEdit={openEdit} />)
        )}
      </div>

      <AddTransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} editingTransaction={editingTx} />

      <button onClick={openAdd}
        className="fixed bottom-20 md:bottom-6 right-4 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-30 transition-all active:scale-95">
        +
      </button>
    </div>
  )
}
