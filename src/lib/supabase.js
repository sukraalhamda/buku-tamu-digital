import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase

if (!url || !anonKey) {
  console.warn('Supabase env not set: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — pakai placeholder, app tetap load tapi fitur DB nonaktif')
  // dummy client biar tidak crash saat build — semua call akan error tapi UI tetap render
  supabase = createClient('https://placeholder.supabase.co', 'sb_publishable_placeholder', {
    auth: { persistSession: false, autoRefreshToken: false }
  })
} else {
  supabase = createClient(url, anonKey)
}

export { supabase }
