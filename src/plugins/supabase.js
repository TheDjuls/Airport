import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://kvgrplrjztfyzbmvjcik.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2Z3JwbHJqenRmeXpibXZqY2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc1MjQ5OTUsImV4cCI6MjAyMzEwMDk5NX0.Xn_Zu10JdMzzbsWm3ozjqrKoJs7HTes3hws3O19olHs')

export default {
    supabase
}