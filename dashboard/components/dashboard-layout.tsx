"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { AIChatPanel } from "./ai-chat-panel"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "admin" | "user"
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar
        userRole={userRole}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        className={cn(
          "fixed inset-y-0 z-50 transition-all duration-300 lg:relative",
          sidebarOpen ? "left-0" : "-left-72",
        )}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          userRole={userRole}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          onChatToggle={() => setChatOpen(!chatOpen)}
        />

        <div className="flex flex-1 overflow-hidden">
          <main className={cn("flex-1 overflow-y-auto p-6 transition-all duration-300", chatOpen ? "mr-80" : "mr-0")}>
            {children}
          </main>

          <AIChatPanel
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            className={cn(
              "fixed inset-y-0 right-0 z-40 w-80 border-l bg-background transition-all duration-300",
              chatOpen ? "translate-x-0" : "translate-x-full",
            )}
          />
        </div>
      </div>
    </div>
  )
}
