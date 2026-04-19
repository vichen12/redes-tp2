export default function StatCard({ label, value, color = 'text-gray-900 dark:text-white', icon, sub }) {
  return (
    <div className="card">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-1">
        {icon && <span className="mr-1">{icon}</span>}{label}
      </p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}
