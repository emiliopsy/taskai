# TaskAI — Contexto del Proyecto para Claude Code

## ¿Qué es este proyecto?
TaskAI es una PWA (Progressive Web App) de gestión de tareas con IA integrada. El usuario escribe texto libre y Claude API extrae, categoriza y prioriza las tareas automáticamente.

## Stack tecnológico
- **Framework**: Next.js 14 (App Router)
- **Estilos**: Tailwind CSS + CSS custom (variables en globals.css)
- **Base de datos**: Supabase (PostgreSQL)
- **IA**: Anthropic Claude API (claude-opus-4-5)
- **Deploy**: Vercel
- **Fuentes**: Syne (display/títulos) + DM Sans (body)

## Estructura del proyecto
```
taskai/
├── app/
│   ├── layout.tsx              # Root layout, fuentes, meta PWA
│   ├── page.tsx                # Página principal: lista + filtros
│   ├── globals.css             # Variables CSS, estilos base, animaciones
│   └── api/
│       └── parse-tasks/
│           └── route.ts        # POST endpoint → llama a Claude API
├── components/
│   ├── TaskCard.tsx            # Card individual de tarea (checkbox, badge, eliminar)
│   ├── TaskInput.tsx           # Textarea libre + botón "Organizar con IA"
│   └── FilterBar.tsx           # Filtros por prioridad y categoría
├── lib/
│   └── supabase.ts             # Cliente Supabase + tipos Task y Category
├── public/
│   └── manifest.json           # PWA manifest
├── supabase-schema.sql         # SQL para ejecutar en Supabase (tablas + seed)
└── .env.local                  # Variables de entorno (NO subir a git)
```

## Variables de entorno requeridas (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
```

## Base de datos (Supabase)

### Tabla: tasks
| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK, auto-generado |
| text | TEXT | Descripción de la tarea |
| category | TEXT | trabajo, personal, compras, salud, finanzas, estudio, hogar, otro |
| priority | TEXT | 'alta' / 'media' / 'baja' |
| date | DATE | nullable |
| done | BOOLEAN | default false |
| created_at | TIMESTAMP | auto |

### Tabla: categories
| Campo | Tipo |
|-------|------|
| id | UUID |
| name | TEXT |
| color | TEXT (hex) |
| icon | TEXT (emoji) |

## Diseño / Estética
- **Tema**: dark, fondo `#0a0a0f`
- **Acento principal**: `#E8844A` (naranja)
- **Superficie**: `#12121a` / `#1a1a26`
- **Variables CSS clave**: `--accent`, `--surface`, `--surface-2`, `--border`, `--text-muted`
- **Badges de prioridad**: `.badge-alta` (rojo), `.badge-media` (amarillo), `.badge-baja` (verde)
- **Animación de entrada**: `.task-enter` (slideIn 0.3s)
- **Fuente display**: Syne 700/800 (títulos, logo)
- **Fuente body**: DM Sans 400/500

## Flujo de la IA (cómo funciona)
1. Usuario escribe texto libre en `TaskInput.tsx`
2. Se hace POST a `/api/parse-tasks` con `{ text: string }`
3. El endpoint llama a Claude API con un prompt que extrae tareas en JSON
4. Claude devuelve `{ tasks: [{ text, category, priority, date }] }`
5. Se insertan en Supabase con `.insert()`
6. El componente padre (`page.tsx`) actualiza el estado local

## Estado actual y bug conocido
- **Error 500 en `/api/parse-tasks`**: posiblemente la `ANTHROPIC_API_KEY` no se está leyendo correctamente. Verificar que `.env.local` exista con el nombre exacto y reiniciar el servidor de desarrollo.
- La app visualmente funciona bien (UI renderiza correctamente)
- Supabase conectado y operativo

## Comandos útiles
```bash
npm run dev        # Servidor local en http://localhost:3000
npm run build      # Build de producción
npm run lint       # Linter
```

## Fase 1 — MVP (implementado)
- [x] Input de texto libre con procesamiento IA
- [x] Lista de tareas filtrable por prioridad y categoría
- [x] Marcar tareas como completadas
- [x] Eliminar tareas
- [x] Persistencia en Supabase
- [x] PWA instalable (manifest.json + meta tags)

## Fase 2 — Próximas features
- [ ] Entrada por voz (Web Speech API)
- [ ] Gestión de categorías personalizadas
- [ ] Fechas límite y recordatorios visuales
- [ ] Vista de calendario

## Fase 3 — Avanzado
- [ ] Historial y estadísticas de productividad
- [ ] Integración Google Calendar
- [ ] Sugerencias proactivas de la IA
- [ ] Notificaciones push

## Convenciones de código
- Todos los componentes son `'use client'` (interactividad)
- El API route (`route.ts`) corre en el servidor (sin `'use client'`)
- Tipos TypeScript definidos en `lib/supabase.ts`
- No usar `useState` en el layout raíz
- Clases de Tailwind para layout/spacing, CSS variables para colores del diseño
