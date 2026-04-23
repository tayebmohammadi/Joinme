import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Guard against placeholder values from the example .env so the app runs
// in pure local mode unless real credentials are configured.
function isRealSupabaseConfig(url, key) {
  if (!url || !key) return false
  if (typeof url !== 'string' || typeof key !== 'string') return false
  if (url.includes('YOUR_PROJECT_ID') || key.includes('YOUR_SUPABASE_ANON_KEY')) return false
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.endsWith('.supabase.co')) return false
  } catch {
    return false
  }
  return true
}

export const isCloudEnabled = isRealSupabaseConfig(supabaseUrl, supabaseAnonKey)

export const supabase = isCloudEnabled
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
