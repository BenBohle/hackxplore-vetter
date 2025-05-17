"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ApplicationBubbleVisualization } from "@/components/application-bubble-visualization"
import { ApplicationBubbleFallback } from "@/components/application-bubble-fallback"

interface ApplicationData {
  id: string
  name: string
  category: string
  usageCount: number
  description: string
  logo: string
  status: string
  errorCount: number
  lastUpdated: string
}

interface AdminDashboardClientProps {
  applications: ApplicationData[]
}

export function AdminDashboardClient({ applications }: AdminDashboardClientProps) {
  const [useAntV, setUseAntV] = useState(true)
  const [loadingFailed, setLoadingFailed] = useState(false)

  // Check if AntV G6 loads within a timeout period
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof window !== "undefined" && !window.G6) {
        console.log("AntV G6 failed to load within timeout, using fallback")
        setUseAntV(false)
        setLoadingFailed(true)
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(timeout)
  }, [])

  return (
    <Card>
      <CardContent className="p-6">
        {useAntV ? (
          <ApplicationBubbleVisualization applications={applications} />
        ) : (
          <ApplicationBubbleFallback applications={applications} />
        )}
      </CardContent>
      {loadingFailed && (
        <p className="text-sm text-muted-foreground mt-2 px-6 pb-4">
          Note: The AntV G6 visualization could not be loaded. Showing alternative visualization instead.
        </p>
      )}
    </Card>
  )
}
