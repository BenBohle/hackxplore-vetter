import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://gozlmvlplhmfxbnksamt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvemxtdmxwbGhtZnhibmtzYW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NTQwODgsImV4cCI6MjA2MzAzMDA4OH0.Tw_UcefnGkdW2Iw4s_FJLlTik8NYtn1rSXyJdA8va-4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)