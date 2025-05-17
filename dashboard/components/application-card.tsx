"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ApplicationDetailModal } from "./application-detail-modal"

interface ApplicationCardProps {
  app: {
    id: string
    name: string
    description: string
    logo: string
    status: "healthy" | "warning" | "critical"
    errorCount: number
    lastUpdated: string
    category: string
    usageCount: number
    isExternal: boolean
    contactPerson: {
      name: string
      email: string
      phone: string
    }
    company?: {
      name: string
      website: string
      supportEmail: string
      supportPhone: string
    }
    recentIssues: Array<{
      date: string
      count: number
    }>
  }
  className?: string
}

export function ApplicationCard({ app, className }: ApplicationCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const statusColors = {
    healthy: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  }

  return (
    <>
      <Card
        className={cn("overflow-hidden cursor-pointer transition-all hover:shadow-md", className)}
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 overflow-hidden rounded-md">
              <img
                src={app.logo || "/placeholder.svg"}
                alt={`${app.name} logo`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-xl">{app.name}</CardTitle>
              <CardDescription className="mt-1 line-clamp-1">{app.description}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDetails(true)
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>View Errors</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <div className={cn("h-2.5 w-2.5 rounded-full", statusColors[app.status])} />
              <span className="text-sm font-medium capitalize">{app.status}</span>
            </div>
            <Badge variant={app.errorCount > 0 ? "destructive" : "outline"}>
              {app.errorCount} {app.errorCount === 1 ? "error" : "errors"}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/20 px-6 py-3">
          <div className="flex w-full items-center justify-between">
            <span className="text-xs text-muted-foreground">Last updated: {app.lastUpdated}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                setShowDetails(true)
              }}
            >
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ApplicationDetailModal {...app} open={showDetails} onOpenChange={setShowDetails} />
    </>
  )
}
