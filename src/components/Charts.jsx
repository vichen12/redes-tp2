import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { formatCurrency } from '../utils/format'
import { getCategoryInfo } from '../utils/categories'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold">{payload[0].name}</p>
      <p style={{ color: payload[0].fill || payload[0].color }}>{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export function GastosPieChart({ data, customCategories = [] }) {
  if (!data?.length) return (
    <div className="h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
      <span className="text-3xl">📊</span>
      <p className="text-sm">Sin gastos este mes</p>
    </div>
  )
  const chartData = data.map(d => {
    const cat = getCategoryInfo(d.category, 'gasto', customCategories)
    return { name: cat.label, value: d.total, color: cat.color, emoji: cat.emoji }
  })
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%"
          innerRadius={45} outerRadius={75} paddingAngle={2}>
          {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function IngresosGastosBar({ data }) {
  if (!data?.length) return null
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }} barGap={2}>
        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} width={45} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="ingresos" fill="#22c55e" radius={[4,4,0,0]} name="Ingresos" maxBarSize={32} />
        <Bar dataKey="gastos" fill="#ef4444" radius={[4,4,0,0]} name="Gastos" maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  )
}
