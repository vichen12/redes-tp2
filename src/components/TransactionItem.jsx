import { getCategoryInfo } from '../utils/categories'
import { formatCurrency, formatDate } from '../utils/format'
import { useApp } from '../context/AppContext'

export default function TransactionItem({ transaction, onEdit }) {
  const { deleteTransaction, customCategories } = useApp()
  const cat = getCategoryInfo(transaction.category, transaction.type, customCategories)
  const isIngreso = transaction.type === 'ingreso'

  const handleDelete = () => {
    if (confirm(`¿Eliminás "${transaction.description}"?`)) deleteTransaction(transaction.id)
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: cat.color + '22' }}>
        {cat.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{transaction.description}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{cat.label} · {formatDate(transaction.date)}</p>
      </div>
      <div className="flex items-center gap-1">
        <span className={`font-bold text-sm ${isIngreso ? 'text-green-500' : 'text-red-500'}`}>
          {isIngreso ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-1">
          <button onClick={() => onEdit(transaction)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm">✏️</button>
          <button onClick={handleDelete}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors text-sm">🗑️</button>
        </div>
      </div>
    </div>
  )
}
