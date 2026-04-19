import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../utils/format'
import { DEFAULT_CATEGORIES, getCategoryInfo } from '../utils/categories'

export default function Presupuesto() {
  const { budgets, summary, addBudget, deleteBudget, customCategories } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: 'comida', monthly_limit: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.monthly_limit) return
    setSaving(true)
    await addBudget(form)
    setForm({ category: 'comida', monthly_limit: '' })
    setShowForm(false)
    setSaving(false)
  }

  const getSpent = (category) => summary.byCategory?.find(c => c.category === category)?.total || 0

  const customGasCats = customCategories.filter(c => c.type === 'gasto')

  const totalBudget = budgets.reduce((s, b) => s + b.monthly_limit, 0)
  const totalSpent = budgets.reduce((s, b) => s + getSpent(b.category), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold">Presupuesto</h1>
          {budgets.length > 0 && (
            <p className="text-sm text-gray-500">
              {formatCurrency(totalSpent)} de {formatCurrency(totalBudget)} usados
            </p>
          )}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          {showForm ? '✕ Cancelar' : '+ Agregar'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="font-semibold mb-4">Nuevo límite de presupuesto</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <optgroup label="Categorías por defecto">
                {DEFAULT_CATEGORIES.gastos.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </optgroup>
              {customGasCats.length > 0 && (
                <optgroup label="Mis categorías">
                  {customGasCats.map(c => <option key={c.id} value={String(c.id)}>{c.emoji} {c.label}</option>)}
                </optgroup>
              )}
            </select>
            <input type="number" placeholder="Límite mensual" min="1" className="input"
              value={form.monthly_limit} onChange={e => setForm(f => ({ ...f, monthly_limit: e.target.value }))} required />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-secondary">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 btn-primary disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {budgets.length === 0 && !showForm ? (
        <div className="card text-center py-14">
          <p className="text-5xl mb-3">💸</p>
          <p className="font-semibold text-gray-700 dark:text-gray-300">Sin presupuestos configurados</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
            Asigná un límite mensual a tus categorías de gasto y recibí alertas antes de pasarte.
          </p>
          <button onClick={() => setShowForm(true)} className="mt-4 btn-primary text-sm inline-block">
            Configurar presupuesto
          </button>
        </div>
      ) : (
        budgets.map(budget => {
          const cat = getCategoryInfo(budget.category, 'gasto', customCategories)
          const spent = getSpent(budget.category)
          const pct = Math.min(100, Math.round((spent / budget.monthly_limit) * 100))
          const isWarning = pct >= 80 && pct < 100
          const isOver = pct >= 100

          return (
            <div key={budget.id}
              className={`card transition-all ${isOver ? 'border-red-300 dark:border-red-800' : isWarning ? 'border-yellow-300 dark:border-yellow-800' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="font-semibold">{cat.label}</span>
                  {isOver && (
                    <span className="badge bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">¡Superado!</span>
                  )}
                  {isWarning && (
                    <span className="badge bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400">⚠️ Cerca</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: isOver ? '#ef4444' : isWarning ? '#eab308' : cat.color }}>
                    {pct}%
                  </span>
                  <button onClick={() => deleteBudget(budget.id)}
                    className="text-gray-300 hover:text-red-500 p-1 transition-colors">🗑️</button>
                </div>
              </div>

              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-2 overflow-hidden">
                <div className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: isOver ? '#ef4444' : isWarning ? '#eab308' : cat.color }} />
              </div>

              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Gastado: <span className="font-medium text-gray-700 dark:text-gray-200">{formatCurrency(spent)}</span></span>
                <span>Límite: <span className="font-medium text-gray-700 dark:text-gray-200">{formatCurrency(budget.monthly_limit)}</span></span>
              </div>

              {isOver && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                  Te pasaste por {formatCurrency(spent - budget.monthly_limit)}
                </p>
              )}
            </div>
          )
        })
      )}

      {/* Regla 50/30/20 */}
      {summary.ingresos > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-1">📐 Regla 50/30/20</h2>
          <p className="text-xs text-gray-500 mb-3">Distribución recomendada de {formatCurrency(summary.ingresos)}</p>
          <div className="space-y-3">
            {[
              { label: '🏠 Necesidades (50%)', rec: summary.ingresos * 0.5, color: '#3b82f6', desc: 'Alquiler, comida, servicios, transporte' },
              { label: '🎮 Deseos (30%)', rec: summary.ingresos * 0.3, color: '#f59e0b', desc: 'Entretenimiento, ropa, salidas' },
              { label: '💰 Ahorro (20%)', rec: summary.ingresos * 0.2, color: '#22c55e', desc: 'Metas, emergencias, inversiones' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <span className="font-bold text-sm" style={{ color: item.color }}>{formatCurrency(item.rec)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
