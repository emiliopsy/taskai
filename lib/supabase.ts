import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Task = {
  id: string
  text: string
  category: string
  priority: 'alta' | 'media' | 'baja'
  date: string | null
  done: boolean
  created_at: string
}

export type Category = {
  id: string
  name: string
  color: string
  icon: string
}
