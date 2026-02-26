'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, Task } from '@/lib/supabase'
import TaskCard from '@/components/TaskCard'
import TaskInput from '@/components/TaskInput'
import FilterBar, { FilterType } from '@/components/FilterBar'

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  const [showInput, setShowInput] = useState(false)

  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setTasks(data as Task[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  function handleTasksAdded(newTasks: Task[]) {
    setTasks((prev) => [...newTasks, ...prev])
    setShowInput(false)
  }

  function handleUpdate(updated: Task) {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  // Filter logic
  const filtered = tasks.filter((t) => {
    if (filter === 'all') return !t.done
    if (filter === 'done') return t.done
    if (['alta', 'media', 'baja'].includes(filter)) return t.priority === filter && !t.done
    // category filter
    return t.category === filter && !t.done
  })

  const pendingCount = tasks.filter((t) => !t.done).length
  const doneCount = tasks.filter((t) => t.done).length

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto px-4">
      {/* Header */}
      <header className="pt-12 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-3xl font-display font-extrabold tracking-tight"
              style={{ color: 'white' }}
            >
              Task<span style={{ color: 'var(--accent)' }}>AI</span>
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {loading
                ? 'Cargando...'
                : `${pendingCount} pendientes · ${doneCount} completadas`}
            </p>
          </div>

          {/* Add button */}
          <button
            onClick={() => setShowInput((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200"
            style={{
              background: showInput ? 'var(--surface-2)' : 'var(--accent)',
              color: 'white',
              border: '1px solid var(--border)',
            }}
          >
            {showInput ? '↑ Cerrar' : '+ Nueva'}
          </button>
        </div>
      </header>

      {/* Input panel */}
      {showInput && (
        <div className="mb-6 task-enter">
          <p
            className="text-[11px] uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            ✦ Entrada libre — la IA se encarga del resto
          </p>
          <TaskInput onTasksAdded={handleTasksAdded} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-4">
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      {/* Task list */}
      <div className="flex-1 flex flex-col gap-2 pb-8">
        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl pulse-glow"
                style={{ background: 'var(--surface)' }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-4">
              {filter === 'done' ? '🎉' : '✦'}
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {filter === 'done'
                ? 'Sin tareas completadas todavía'
                : filter === 'all'
                ? 'Todo limpio. Agregá una tarea arriba.'
                : 'Sin tareas en esta categoría'}
            </p>
          </div>
        ) : (
          filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
