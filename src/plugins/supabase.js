import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://vzzfuieatuqlmflftbng.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6emZ1aWVhdHVxbG1mbGZ0Ym5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYwNDk1MTYsImV4cCI6MjAyMTYyNTUxNn0.GS9LVwD9zGEbS9ycCAwEXrjYTvin0n8sRgVhJ2UIEy4')

export default {
    supabase
}