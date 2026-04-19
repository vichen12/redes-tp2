export const DEFAULT_CATEGORIES = {
  ingresos: [
    { id: 'sueldo', label: 'Sueldo', emoji: '💰', color: '#22c55e' },
    { id: 'freelance', label: 'Freelance', emoji: '💻', color: '#3b82f6' },
    { id: 'emprendimiento', label: 'Emprendimiento', emoji: '🚀', color: '#8b5cf6' },
    { id: 'inversion', label: 'Inversión', emoji: '📈', color: '#f59e0b' },
    { id: 'relacion_dependencia', label: 'Relación de dependencia', emoji: '🏢', color: '#10b981' },
    { id: 'otros_ingresos', label: 'Otros ingresos', emoji: '📥', color: '#6366f1' },
  ],
  gastos: [
    { id: 'comida', label: 'Comida', emoji: '🛒', color: '#f97316' },
    { id: 'servicios', label: 'Servicios', emoji: '⚡', color: '#eab308' },
    { id: 'transporte', label: 'Transporte', emoji: '🚌', color: '#06b6d4' },
    { id: 'salud', label: 'Salud', emoji: '❤️', color: '#ef4444' },
    { id: 'educacion', label: 'Educación', emoji: '📚', color: '#6366f1' },
    { id: 'entretenimiento', label: 'Entretenimiento', emoji: '🎮', color: '#ec4899' },
    { id: 'ropa', label: 'Ropa', emoji: '👕', color: '#14b8a6' },
    { id: 'hogar', label: 'Hogar', emoji: '🏠', color: '#84cc16' },
    { id: 'deudas', label: 'Deudas', emoji: '💳', color: '#dc2626' },
    { id: 'netflix', label: 'Suscripciones', emoji: '📺', color: '#a855f7' },
    { id: 'mascota', label: 'Mascota', emoji: '🐾', color: '#f59e0b' },
    { id: 'otros_gastos', label: 'Otros gastos', emoji: '📤', color: '#9ca3af' },
  ]
}

export const getCategoryInfo = (categoryId, type, customCategories = []) => {
  const list = type === 'ingreso' ? DEFAULT_CATEGORIES.ingresos : DEFAULT_CATEGORIES.gastos
  const found = list.find(c => c.id === categoryId)
  if (found) return found
  const custom = customCategories.find(c => c.id === `custom_${c.id}` || String(c.id) === String(categoryId))
  return custom || { label: categoryId, emoji: '📌', color: '#9ca3af' }
}

export const FINANCIAL_TIPS = [
  { emoji: '💡', tip: 'Regla 50/30/20: 50% para necesidades, 30% para deseos, 20% para ahorro.' },
  { emoji: '☕', tip: 'Los gastos hormiga (café, snacks, apps) pueden sumar más de $15.000 al mes sin que te des cuenta.' },
  { emoji: '📊', tip: 'Revisá tus gastos fijos cada 3 meses. Siempre hay algo que se puede optimizar.' },
  { emoji: '🎯', tip: 'Tener una meta concreta multiplica por 3 las chances de ahorrar efectivamente.' },
  { emoji: '⚠️', tip: 'El fondo de emergencia ideal es de 3 a 6 meses de tus gastos fijos mensuales.' },
  { emoji: '🔄', tip: 'Automatizá el ahorro: separá la plata apenas cobres, no al final del mes.' },
  { emoji: '📱', tip: 'Revisá tus suscripciones activas. Cancelá las que no usás con frecuencia.' },
  { emoji: '💰', tip: 'Pagá deudas de mayor a menor tasa de interés: ahorrás más en el largo plazo.' },
  { emoji: '🧠', tip: 'La psicología del dinero: esperá 48hs antes de hacer una compra impulsiva.' },
  { emoji: '📅', tip: 'Registrar gastos a diario tarda menos de 2 minutos y cambia totalmente tu relación con el dinero.' },
]

export const GOAL_EMOJIS = ['🎯','✈️','👟','🏠','🚗','💍','📱','💪','🌍','🐾','🎓','💻','🎸','🏖️','🍕']
export const GOAL_COLORS = ['#22c55e','#3b82f6','#f59e0b','#ec4899','#8b5cf6','#ef4444','#06b6d4','#10b981','#f97316','#84cc16']
