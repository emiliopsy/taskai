'use client'

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'alta', label: '🔴 Alta' },
  { key: 'media', label: '🟡 Media' },
  { key: 'baja', label: '🟢 Baja' },
  { key: 'done', label: '✓ Hechas' },
]

const CATEGORIES = [
  { key: 'trabajo', label: '💼 Trabajo' },
  { key: 'personal', label: '👤 Personal' },
  { key: 'compras', label: '🛒 Compras' },
  { key: 'salud', label: '❤️ Salud' },
  { key: 'finanzas', label: '💰 Finanzas' },
  { key: 'estudio', label: '📚 Estudio' },
  { key: 'hogar', label: '🏠 Hogar' },
]

export type FilterType = 'all' | 'alta' | 'media' | 'baja' | 'done' | string

export default function FilterBar({
  active,
  onChange,
}: {
  active: FilterType
  onChange: (f: FilterType) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {[...FILTERS, ...CATEGORIES].map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150"
          style={{
            background: active === f.key ? 'var(--accent)' : 'var(--surface)',
            color: active === f.key ? 'white' : 'var(--text-muted)',
            border: `1px solid ${active === f.key ? 'var(--accent)' : 'var(--border)'}`,
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
