"use client"

import { Bell, Menu, MessageSquare, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  userRole: "admin" | "user"
  onSidebarToggle: () => void
  onChatToggle: () => void
}

export function DashboardHeader({ userRole, onSidebarToggle, onChatToggle }: DashboardHeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="lg:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <div className="relative hidden md:flex md:w-64">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." className="w-full pl-8" />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute top-0 right-0 h-5 w-5 rounded-full p-0 text-xs transform translate-x-1/2 -translate-y-1/2">
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  {userRole === "admin" ? "5" : "2"}
                </div>
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
          >

            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {[ 1, 2, 3 ].map((i) => (
                <DropdownMenuItem key={i} className="cursor-pointer p-4">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">New error detected</div>
                    <div className="text-sm text-muted-foreground">Error #{i}001 was detected on Marketing PC</div>
                    <div className="text-xs text-muted-foreground">2 minute{i > 1 ? "s" : ""} ago</div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={onChatToggle}>
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Open AI chat</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                <AvatarFallback>{userRole === "admin" ? "AD" : "US"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            style={{ backgroundColor: "rgba(255, 255, 255, 1)", opacity:"90%", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <DropdownMenuLabel>{userRole === "admin" ? "Admin Account" : "User Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
