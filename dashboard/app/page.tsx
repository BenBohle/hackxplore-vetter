"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import LoginForm from "@/components/login-form"
import { AdminDashboardPage } from "@/components/dashboard-admin"
import { UserDashboardPage } from "@/components/dashboard-user"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user ?? null
      if (ignore) return
      setUser(user)
      if (user) {
        const { data: roleData } = await supabase
          .from("role")
          .select("role")
          .eq("user_id", user.id)
          .single()
        if (ignore) return
        setRole(roleData?.role ?? null)
      }
      setLoading(false)
    }

    checkUser()

    // Reagiere auf Login/Logout-Events
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      setLoading(true)
      setUser(null)
      setRole(null)
      checkUser()
    })

    return () => {
      ignore = true
      listener?.subscription.unsubscribe()
    }
  }, [])

  if (loading) return <div>Loading...</div>
  if (!user) return <AdminDashboardPage />
  if (role === "admin") return <AdminDashboardPage />
  if (role === "user") return <UserDashboardPage userName={user?.user_metadata?.full_name || user?.email || "User"} />

  // Zeige Fallback NUR wenn user geladen und keine Rolle gefunden wurde
  return <div>Kein Zugriff</div>
}