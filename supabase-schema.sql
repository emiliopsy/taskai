-- TaskAI — Schema SQL para Supabase
-- Ejecutar esto en el SQL Editor de Supabase (https://app.supabase.com)

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#E8844A',
  icon TEXT NOT NULL DEFAULT '📌',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categorías por defecto
INSERT INTO categories (name, color, icon) VALUES
  ('trabajo',   '#6366f1', '💼'),
  ('personal',  '#E8844A', '👤'),
  ('compras',   '#10b981', '🛒'),
  ('salud',     '#ef4444', '❤️'),
  ('finanzas',  '#f59e0b', '💰'),
  ('estudio',   '#3b82f6', '📚'),
  ('hogar',     '#8b5cf6', '🏠'),
  ('otro',      '#6b7280', '📌')
ON CONFLICT DO NOTHING;

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'otro',
  priority TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baja')),
  date DATE,
  done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks(done);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- Row Level Security (opcional para uso personal, activar si agregás auth)
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
