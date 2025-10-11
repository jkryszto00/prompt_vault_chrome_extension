import { supabase } from './supabase'

/**
 * Check if user is currently authenticated
 * Can be used anywhere in the extension (popup, options, content script)
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession()
  return session !== null
}

/**
 * Get current user session
 * Returns null if not authenticated
 */
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Get current user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Listen for auth state changes
 * Useful for keeping auth state synchronized across extension pages
 */
export function onAuthStateChange(callback: (authenticated: boolean) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session !== null)
  })

  return () => subscription.unsubscribe()
}
