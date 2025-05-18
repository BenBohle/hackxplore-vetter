"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  AppWindowIcon as Apps,
  AlertTriangle,
  Settings,
  Users,
  BarChart,
  ChevronLeft,
  Laptop,
  LineChart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  userRole: "admin" | "user"
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export function DashboardSidebar({ userRole, isOpen, onToggle, className }: DashboardSidebarProps) {
  const pathname = usePathname()

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Applications",
      href: "/dashboard/applications",
      icon: Apps,
    },
    {
      title: "Error Tracking",
      href: "/dashboard/errors",
      icon: AlertTriangle,
    },
    {
      title: "Error Analytics",
      href: "/dashboard/admin/error-analytics",
      icon: LineChart,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const userNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/user",
      icon: LayoutDashboard,
    },
    {
      title: "My Applications",
      href: "/dashboard/my-applications",
      icon: Apps,
    },
    {
      title: "My Device",
      href: "/dashboard/my-device",
      icon: Laptop,
    },
    {
      title: "My Errors",
      href: "/dashboard/my-errors",
      icon: AlertTriangle,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const navItems = userRole === "admin" ? adminNavItems : userNavItems

  return (
    <aside className={cn("flex h-full w-72 flex-col border-r bg-muted/10", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center justify-center w-full">
          <img
            src="/tracer-logo-weiß-blau.png"
            alt="Logo"
            className="h-16 w-auto mx-auto"
            style={{ display: "block" }}
          />
        </Link>
        <Button variant="ghost" size="icon" onClick={onToggle} className="ml-auto lg:hidden">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted/50",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t p-4">
        <div className="rounded-md bg-muted/50 p-3">
          <div className="text-xs font-medium">Workspace</div>
          <div className="mt-1 text-sm font-semibold">{userRole === "admin" ? "IT Department" : "Marketing Team"}</div>
        </div>
      </div>
    </aside>
  )
}
