import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { DEFAULT_CATEGORIES } from '../utils/categories'
import { GOAL_COLORS, GOAL_EMOJIS } from '../utils/categories'

export default function Categorias() {
  const { customCategories, addCustomCategory, deleteCustomCategory } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'gasto', label: '', emoji: '📌', color: '#9ca3af' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.label) return
    setSaving(true)
    await addCustomCategory(form)
    setForm({ type: 'gasto', label: '', emoji: '📌', color: '#9ca3af' })
    setShowForm(false)
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Categorías</h1>
          <p className="text-sm text-gray-500">Personalizá tus categorías de ingresos y gastos</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          {showForm ? '✕ Cancelar' : '+ Nueva categoría'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="font-semibold mb-4">Crear categoría</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <button type="button" onClick={() => setForm(f => ({ ...f, type: 'ingreso' }))}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${form.type === 'ingreso' ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                Ingreso
              </button>
              <button type="button" onClick={() => setForm(f => ({ ...f, type: 'gasto' }))}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${form.type === 'gasto' ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                Gasto
              </button>
            </div>
            <div className="flex gap-2">
              <select className="input w-24" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}>
                {GOAL_EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <input type="text" placeholder="Nombre de la categoría" className="input flex-1"
                value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {GOAL_COLORS.map(c => (
                  <button type="button" key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-8 h-8 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <button type="submit" disabled={saving} className="w-full btn-primary disabled:opacity-50">
              {saving ? 'Guardando...' : 'Crear categoría'}
            </button>
          </form>
        </div>
      )}

      {/* Default categories (read-only) */}
      <div className="card">
        <h2 className="font-semibold text-sm mb-3 text-gray-500 uppercase tracking-wide">Categorías de ingresos (por defecto)</h2>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_CATEGORIES.ingresos.map(c => (
            <span key={c.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: c.color + '22', color: c.color }}>
              {c.emoji} {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-sm mb-3 text-gray-500 uppercase tracking-wide">Categorías de gastos (por defecto)</h2>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_CATEGORIES.gastos.map(c => (
            <span key={c.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: c.color + '22', color: c.color }}>
              {c.emoji} {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* Custom categories */}
      {customCategories.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-sm mb-3 text-gray-500 uppercase tracking-wide">Mis categorías</h2>
          <div className="space-y-2">
            {customCategories.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: c.color + '22' }}>{c.emoji}</span>
                  <span className="font-medium text-sm">{c.label}</span>
                  <span className={`badge text-xs ${c.type === 'ingreso' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
                    {c.type}
                  </span>
                </span>
                <button onClick={() => deleteCustomCategory(c.id)}
                  className="text-gray-300 hover:text-red-500 p-1 transition-colors">🗑️</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {customCategories.length === 0 && !showForm && (
        <div className="card text-center py-10">
          <p className="text-3xl mb-2">🏷️</p>
          <p className="text-sm text-gray-400">Todavía no tenés categorías personalizadas</p>
        </div>
      )}
    </div>
  )
}
