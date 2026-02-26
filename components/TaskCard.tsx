'use client'

import { useState } from 'react'
import { supabase, Task } from '@/lib/supabase'

const CATEGORY_ICONS: Record<string, string> = {
  trabajo: '💼',
  personal: '👤',
  compras: '🛒',
  salud: '❤️',
  finanzas: '💰',
  estudio: '📚',
  hogar: '🏠',
  otro: '📌',
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

export default function TaskCard({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}) {
  const [loading, setLoading] = useState(false)

  async function toggleDone() {
    setLoading(true)
    const { error } = await supabase
      .from('tasks')
      .update({ done: !task.done })
      .eq('id', task.id)
    if (!error) onUpdate({ ...task, done: !task.done })
    setLoading(false)
  }

  async function deleteTask() {
    setLoading(true)
    const { error } = await supabase.from('tasks').delete().eq('id', task.id)
    if (!error) onDelete(task.id)
    setLoading(false)
  }

  return (
    <div
      className={`task-enter flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 ${
        task.done
          ? 'opacity-40 bg-[var(--surface)]'
          : 'bg-[var(--surface)] hover:bg-[var(--surface-2)]'
      }`}
      style={{ borderColor: 'var(--border)' }}
    >
      <button onClick={toggleDone} disabled={loading} className="mt-0.5">
        <input
          type="checkbox"
          className="task-check pointer-events-none"
          checked={task.done}
          readOnly
        />
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            task.done ? 'line-through text-[var(--text-muted)]' : 'text-white'
          }`}
        >
          {task.text}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {/* Category */}
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            {CATEGORY_ICONS[task.category] || '📌'}
            {task.category}
          </span>

          {/* Priority */}
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full badge-${task.priority}`}
          >
            {task.priority}
          </span>

          {/* Date */}
          {task.date && (
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
              📅 {formatDate(task.date)}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={deleteTask}
        disabled={loading}
        className="text-[var(--text-muted)] hover:text-red-400 transition-colors text-lg leading-none mt-0.5 shrink-0"
        aria-label="Eliminar"
      >
        ×
      </button>
    </div>
  )
}
