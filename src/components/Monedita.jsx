const MOODS = {
  neutral: {
    face: '😐',
    title: 'Sin datos todavía',
    message: '¡Empezá a registrar tus movimientos! Monedita te espera.',
    bg: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    glow: '',
  },
  ok: {
    face: '🙂',
    title: 'Vas bien encaminado',
    message: '¡Cada peso cuenta! Cuando empezás a ahorrar, Monedita lo nota y te alienta.',
    bg: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900',
    glow: 'shadow-yellow-100 dark:shadow-yellow-900',
  },
  strong: {
    face: '💪',
    title: 'En la recta final',
    message: '¡Un empujón más! Estás cerca de tu meta del 20%. ¡Vos podés!',
    bg: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900',
    glow: 'shadow-blue-100 dark:shadow-blue-900',
  },
  crown: {
    face: '👑',
    title: '¡Meta de ahorro alcanzada!',
    message: '¡Sos una máquina! Superaste el 20% de ahorro este mes. Monedita brilla de orgullo.',
    bg: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900',
    glow: 'shadow-green-100 dark:shadow-green-900',
  },
  sad: {
    face: '😢',
    title: 'Gastás más de lo que ganás',
    message: 'Revisá tus gastos con urgencia. ¡Vos podés revertirlo! Monedita confía en vos.',
    bg: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900',
    glow: 'shadow-red-100 dark:shadow-red-900',
  },
}

export default function Monedita({ mood }) {
  const m = MOODS[mood] || MOODS.neutral
  return (
    <div className={`card border ${m.bg} ${m.glow} flex items-center gap-4`}>
      <div className="text-5xl animate-wiggle select-none">{m.face}</div>
      <div>
        <p className="font-bold text-gray-900 dark:text-white">{m.title}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{m.message}</p>
      </div>
    </div>
  )
}
