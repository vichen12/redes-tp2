import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { DEFAULT_CATEGORIES } from '../utils/categories'

export default function AddTransactionModal({ isOpen, onClose, editingTransaction }) {
  const { addTransaction, updateTransaction, customCategories } = useApp()
  const [form, setForm] = useState({
    type: 'gasto', amount: '', description: '', category: 'comida',
    date: new Date().toISOString().split('T')[0],
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    if (editingTransaction) {
      setForm({
        type: editingTransaction.type,
        amount: editingTransaction.amount,
        description: editingTransaction.description,
        category: editingTransaction.category,
        date: editingTransaction.date,
      })
    } else {
      setForm({ type: 'gasto', amount: '', description: '', category: 'comida', date: new Date().toISOString().split('T')[0] })
    }
  }, [editingTransaction, isOpen])

  const builtInCats = form.type === 'ingreso' ? DEFAULT_CATEGORIES.ingresos : DEFAULT_CATEGORIES.gastos
  const customCats = customCategories.filter(c => c.type === form.type).map(c => ({ id: String(c.id), label: c.label, emoji: c.emoji, color: c.color }))
  const categories = [...builtInCats, ...customCats]

  const handleTypeChange = (type) => {
    const defaultCat = type === 'ingreso' ? 'sueldo' : 'comida'
    setForm(f => ({ ...f, type, category: defaultCat }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || !form.description) return
    setSaving(true)
    try {
      if (editingTransaction) await updateTransaction(editingTransaction.id, form)
      else await addTransaction(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">{editingTransaction ? 'Editar' : 'Nuevo'} movimiento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl p-1">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <button type="button" onClick={() => handleTypeChange('ingreso')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${form.type === 'ingreso' ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              + Ingreso
            </button>
            <button type="button" onClick={() => handleTypeChange('gasto')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${form.type === 'gasto' ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              − Gasto
            </button>
          </div>

          <input type="text" placeholder="Concepto (ej: Sueldo, Supermercado...)"
            className="input" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />

          <select className="input" value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </select>

          <input type="number" placeholder="Monto" min="1" step="any" className="input"
            value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />

          <input type="date" className="input" value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
