import { supabase, hasSupabase } from './supabase'

// ── localStorage helpers ──────────────────────────────────────────────────────
const ls = {
  get: (key, def = []) => {
    try { return JSON.parse(localStorage.getItem(`tf_${key}`)) ?? def } catch { return def }
  },
  set: (key, val) => localStorage.setItem(`tf_${key}`, JSON.stringify(val)),
  nextId: (key) => {
    const rows = ls.get(key)
    return rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1
  },
}

// ── Transactions ──────────────────────────────────────────────────────────────
export async function getTransactions(month) {
  if (hasSupabase) {
    const { data } = await supabase.from('transactions').select('*')
      .like('date', `${month}%`).order('date', { ascending: false })
    return data ?? []
  }
  return ls.get('transactions').filter(t => t.date.startsWith(month))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function addTransaction(tx) {
  if (hasSupabase) {
    const { data } = await supabase.from('transactions').insert([tx]).select().single()
    return data
  }
  const rows = ls.get('transactions')
  const row = { ...tx, id: ls.nextId('transactions'), amount: Number(tx.amount) }
  ls.set('transactions', [row, ...rows])
  return row
}

export async function updateTransaction(id, tx) {
  if (hasSupabase) {
    await supabase.from('transactions').update(tx).eq('id', id)
    return
  }
  ls.set('transactions', ls.get('transactions').map(r => r.id === id ? { ...r, ...tx } : r))
}

export async function deleteTransaction(id) {
  if (hasSupabase) { await supabase.from('transactions').delete().eq('id', id); return }
  ls.set('transactions', ls.get('transactions').filter(r => r.id !== id))
}

export async function getSummary(month) {
  const txs = await getTransactions(month)
  const ingresos = txs.filter(t => t.type === 'ingreso').reduce((s, t) => s + Number(t.amount), 0)
  const gastos = txs.filter(t => t.type === 'gasto').reduce((s, t) => s + Number(t.amount), 0)
  const byCatMap = {}
  txs.filter(t => t.type === 'gasto').forEach(t => {
    byCatMap[t.category] = (byCatMap[t.category] || 0) + Number(t.amount)
  })
  const byCategory = Object.entries(byCatMap)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
  return { ingresos, gastos, ahorro: ingresos - gastos, byCategory }
}

// ── Goals ─────────────────────────────────────────────────────────────────────
export async function getGoals() {
  if (hasSupabase) {
    const { data } = await supabase.from('goals').select('*').order('id')
    return data ?? []
  }
  return ls.get('goals')
}

export async function addGoal(goal) {
  if (hasSupabase) {
    const { data } = await supabase.from('goals').insert([goal]).select().single()
    return data
  }
  const rows = ls.get('goals')
  const row = { ...goal, id: ls.nextId('goals'), current_amount: 0, target_amount: Number(goal.target_amount) }
  ls.set('goals', [...rows, row])
  return row
}

export async function updateGoalAmount(id, amount) {
  if (hasSupabase) {
    const { data: goal } = await supabase.from('goals').select('current_amount, target_amount').eq('id', id).single()
    const newAmt = Math.min(goal.target_amount, goal.current_amount + Number(amount))
    await supabase.from('goals').update({ current_amount: newAmt }).eq('id', id)
    return
  }
  const rows = ls.get('goals')
  ls.set('goals', rows.map(r => {
    if (r.id !== id) return r
    return { ...r, current_amount: Math.min(r.target_amount, r.current_amount + Number(amount)) }
  }))
}

export async function deleteGoal(id) {
  if (hasSupabase) { await supabase.from('goals').delete().eq('id', id); return }
  ls.set('goals', ls.get('goals').filter(r => r.id !== id))
}

// ── Budgets ───────────────────────────────────────────────────────────────────
export async function getBudgets() {
  if (hasSupabase) {
    const { data } = await supabase.from('budgets').select('*').order('id')
    return data ?? []
  }
  return ls.get('budgets')
}

export async function addBudget(budget) {
  if (hasSupabase) {
    await supabase.from('budgets').upsert([budget], { onConflict: 'category' })
    return
  }
  const rows = ls.get('budgets')
  const existing = rows.findIndex(r => r.category === budget.category)
  if (existing >= 0) {
    rows[existing] = { ...rows[existing], monthly_limit: Number(budget.monthly_limit) }
    ls.set('budgets', rows)
  } else {
    ls.set('budgets', [...rows, { ...budget, id: ls.nextId('budgets'), monthly_limit: Number(budget.monthly_limit) }])
  }
}

export async function deleteBudget(id) {
  if (hasSupabase) { await supabase.from('budgets').delete().eq('id', id); return }
  ls.set('budgets', ls.get('budgets').filter(r => r.id !== id))
}

// ── Custom categories ─────────────────────────────────────────────────────────
export async function getCustomCategories() {
  if (hasSupabase) {
    const { data } = await supabase.from('custom_categories').select('*').order('id')
    return data ?? []
  }
  return ls.get('custom_categories')
}

export async function addCustomCategory(cat) {
  if (hasSupabase) {
    const { data } = await supabase.from('custom_categories').insert([cat]).select().single()
    return data
  }
  const rows = ls.get('custom_categories')
  const row = { ...cat, id: ls.nextId('custom_categories') }
  ls.set('custom_categories', [...rows, row])
  return row
}

export async function deleteCustomCategory(id) {
  if (hasSupabase) { await supabase.from('custom_categories').delete().eq('id', id); return }
  ls.set('custom_categories', ls.get('custom_categories').filter(r => r.id !== id))
}
