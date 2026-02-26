'use client'

import { useState, useRef } from 'react'
import { supabase, Task } from '@/lib/supabase'

export default function TaskInput({ onTasksAdded }: { onTasksAdded: (tasks: Task[]) => void }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || loading) return

    setLoading(true)
    setError(null)

    try {
      // 1. Call Claude API to parse tasks
      const res = await fetch('/api/parse-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) throw new Error('Error al procesar el texto')

      const { tasks: parsedTasks } = await res.json()

      if (!parsedTasks?.length) {
        setError('No encontré tareas en ese texto. Intentá de nuevo.')
        return
      }

      // 2. Save to Supabase
      const { data, error: dbError } = await supabase
        .from('tasks')
        .insert(
          parsedTasks.map((t: Omit<Task, 'id' | 'done' | 'created_at'>) => ({
            text: t.text,
            category: t.category,
            priority: t.priority,
            date: t.date,
            done: false,
          }))
        )
        .select()

      if (dbError) throw dbError

      onTasksAdded(data as Task[])
      setText('')
      textareaRef.current?.focus()
    } catch (err) {
      console.error(err)
      setError('Algo salió mal. Verificá tu conexión e intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="input-glow rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Escribí tus tareas en texto libre...\n\nEj: "llamar al médico mañana, entregar informe urgente, comprar leche"`}
          rows={4}
          className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-white placeholder:text-[var(--text-muted)] resize-none outline-none leading-relaxed"
          disabled={loading}
        />
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-[11px] text-[var(--text-muted)]">
            {loading ? (
              <span className="pulse-glow">✦ Analizando con IA...</span>
            ) : (
              <span>⌘↵ para procesar</span>
            )}
          </span>
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: loading ? 'rgba(232,132,74,0.3)' : 'var(--accent)',
              color: 'white',
            }}
          >
            {loading ? (
              <>
                <span className="pulse-glow">✦</span>
                Procesando
              </>
            ) : (
              <>
                <span>✦</span>
                Organizar
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400 px-1">{error}</p>
      )}
    </form>
  )
}
