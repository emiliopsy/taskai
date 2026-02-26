# TaskAI — Organizador Inteligente de Tareas

> PWA móvil + web con IA integrada. Escribís en texto libre y la IA organiza todo automáticamente.

## 🚀 Setup en 4 pasos (≈15 minutos)

### Paso 1 — Supabase (base de datos)

1. Ir a [supabase.com](https://supabase.com) → **Sign up** con Google
2. Crear nuevo proyecto (elegí una región cercana, ej: South America)
3. Ir a **SQL Editor** → pegar y ejecutar el contenido de `supabase-schema.sql`
4. Ir a **Settings → API** y copiar:
   - `Project URL` → será tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon / public key` → será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Paso 2 — Google Gemini API (gratis)

1. Ir a [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Crear nueva API key → copiar como `GOOGLE_API_KEY`
3. El tier gratuito incluye 1500 requests/día con `gemini-1.5-flash`

### Paso 3 — Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto con estos valores:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
GOOGLE_API_KEY=AIzaSy...
```

### Paso 4 — Correr localmente

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy en Vercel

1. Subí este proyecto a un repositorio GitHub (puede ser privado)
2. Ir a [vercel.com](https://vercel.com) → **Import Git Repository**
3. En **Environment Variables**, agregar las 3 variables del `.env.local`
4. **Deploy** → obtenés una URL pública tipo `taskai-tuusuario.vercel.app`

---

## 📱 Instalar como app en el celular

**Android (Chrome):**
- Abrí la URL en Chrome
- Tocá los 3 puntos → "Agregar a pantalla de inicio"

**iOS (Safari):**
- Abrí la URL en Safari
- Tocá el botón compartir → "Agregar a pantalla de inicio"

---

## 🗂 Estructura del proyecto

```
taskai/
├── app/
│   ├── layout.tsx          # Layout principal + PWA meta tags
│   ├── page.tsx            # Pantalla principal con lista de tareas
│   ├── globals.css         # Estilos globales
│   └── api/
│       └── parse-tasks/
│           └── route.ts    # Endpoint que llama a Gemini API
├── components/
│   ├── TaskCard.tsx        # Card individual de tarea
│   ├── TaskInput.tsx       # Input de texto libre con IA
│   └── FilterBar.tsx       # Filtros por prioridad/categoría
├── lib/
│   └── supabase.ts         # Cliente Supabase + tipos TypeScript
├── public/
│   └── manifest.json       # Manifest PWA
└── supabase-schema.sql     # Schema SQL para ejecutar en Supabase
```

---

## 💡 Cómo usar

1. Tocá **+ Nueva** en la esquina superior derecha
2. Escribí tus tareas en texto libre, por ejemplo:
   - *"llamar a Juan mañana, entregar el informe esta semana con alta prioridad, comprar leche"*
3. Tocá **Organizar**
4. La IA las analiza y las agrega organizadas con categoría, prioridad y fecha

---

## 📋 Fase 2 (próximamente)

- [ ] Entrada por voz (Web Speech API)
- [ ] Categorías personalizadas
- [ ] Fechas límite y recordatorios
- [ ] Vista de calendario

---

## 💰 Costos estimados

| Servicio | Plan | Costo |
|----------|------|-------|
| Vercel | Hobby | Gratis |
| Supabase | Free | Gratis |
| Google Gemini | Free tier | Gratis (1500 req/día) |

**Total: $0/mes** para uso personal normal.
