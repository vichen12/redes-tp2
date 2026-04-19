import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../utils/format'
import { GOAL_EMOJIS, GOAL_COLORS } from '../utils/categories'

export default function Metas() {
  const { goals, addGoal, updateGoalAmount, deleteGoal, summary } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', target_amount: '', emoji: '🎯', color: '#22c55e' })
  const [addAmounts, setAddAmounts] = useState({})
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.target_amount) return
    setSaving(true)
    await addGoal(form)
    setForm({ name: '', target_amount: '', emoji: '🎯', color: '#22c55e' })
    setShowForm(false)
    setSaving(false)
  }

  const handleAdd = async (goalId) => {
    const amount = parseFloat(addAmounts[goalId])
    if (!amount || amount <= 0) return
    await updateGoalAmount(goalId, amount)
    setAddAmounts(prev => ({ ...prev, [goalId]: '' }))
  }

  const handleDelete = (id, name) => {
    if (confirm(`¿Eliminás la meta "${name}"?`)) deleteGoal(id)
  }

  const totalGoals = goals.reduce((s, g) => s + g.target_amount, 0)
  const totalSaved = goals.reduce((s, g) => s + g.current_amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Metas de ahorro</h1>
          {goals.length > 0 && (
            <p className="text-sm text-gray-500">{formatCurrency(totalSaved)} de {formatCurrency(totalGoals)} ahorrados</p>
          )}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          {showForm ? '✕ Cancelar' : '+ Nueva meta'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card">
          <h2 className="font-semibold mb-4">Crear nueva meta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <select className="input w-24" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}>
                {GOAL_EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <input type="text" placeholder="Nombre (ej: Zapatillas, Viaje...)" className="input flex-1"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <input type="number" placeholder="Monto objetivo" min="1" className="input"
              value={form.target_amount} onChange={e => setForm(f => ({ ...f, target_amount: e.target.value }))} required />
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
              {saving ? 'Creando...' : 'Crear meta'}
            </button>
          </form>
        </div>
      )}

      {/* Goals list */}
      {goals.length === 0 && !showForm ? (
        <div className="card text-center py-14">
          <p className="text-5xl mb-3">🎯</p>
          <p className="font-semibold text-gray-700 dark:text-gray-300">Todavía no tenés metas</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
            Crear una meta te da propósito para ahorrar. Empezá con algo concreto.
          </p>
          <button onClick={() => setShowForm(true)} className="mt-4 btn-primary text-sm inline-block">
            Crear mi primera meta
          </button>
        </div>
      ) : (
        goals.map(goal => {
          const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
          const remaining = goal.target_amount - goal.current_amount
          const done = pct >= 100

          return (
            <div key={goal.id} className={`card transition-all ${done ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{goal.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{goal.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(goal.current_amount)} <span className="text-gray-400">de</span> {formatCurrency(goal.target_amount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold" style={{ color: done ? '#22c55e' : goal.color }}>{pct}%</span>
                  <button onClick={() => handleDelete(goal.id, goal.name)}
                    className="text-gray-300 hover:text-red-500 p-1 transition-colors">🗑️</button>
                </div>
              </div>

              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-3 overflow-hidden">
                <div className="h-3 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: done ? '#22c55e' : goal.color }} />
              </div>

              {done ? (
                <p className="text-center text-green-600 dark:text-green-400 font-bold text-sm py-1">
                  🎉 ¡Meta alcanzada! ¡Sos una máquina!
                </p>
              ) : (
                <div className="flex gap-2">
                  <input type="number" min="1"
                    placeholder={`Agregar ahorro (falta ${formatCurrency(remaining)})`}
                    className="input flex-1 text-sm"
                    value={addAmounts[goal.id] || ''}
                    onChange={e => setAddAmounts(prev => ({ ...prev, [goal.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleAdd(goal.id)} />
                  <button onClick={() => handleAdd(goal.id)} className="btn-primary text-sm px-4">+</button>
                </div>
              )}
            </div>
          )
        })
      )}

      {/* Regla 50/30/20 hint */}
      {summary.ingresos > 0 && (
        <div className="card bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
          <p className="text-sm font-semibold mb-1">💡 Según la regla 50/30/20</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Con tus ingresos de {formatCurrency(summary.ingresos)}, deberías ahorrar al menos{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(summary.ingresos * 0.2)}</span> este mes.
          </p>
        </div>
      )}
    </div>
  )
}
