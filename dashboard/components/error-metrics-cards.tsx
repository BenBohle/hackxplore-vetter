"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, AlertTriangle, Clock, CheckCircle2, Users } from "lucide-react"

interface ErrorMetricsCardsProps {
  totalErrors: number
  activeErrors: number
  criticalErrors: number
  avgResolutionTime: string
  errorRate: number
  errorRateChange: number
  affectedUsers: number
  resolvedLast24h: number
}

export function ErrorMetricsCards({
  totalErrors,
  activeErrors,
  criticalErrors,
  avgResolutionTime,
  errorRate,
  errorRateChange,
  affectedUsers,
  resolvedLast24h,
}: ErrorMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Active Errors</CardTitle>
            <CardDescription>Errors requiring attention</CardDescription>
          </div>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeErrors}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((activeErrors / totalErrors) * 100)}% of total errors
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <CardDescription>High priority errors</CardDescription>
          </div>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{criticalErrors}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((criticalErrors / activeErrors) * 100)}% of active errors
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <CardDescription>Time to resolve errors</CardDescription>
          </div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgResolutionTime}</div>
          <p className="text-xs text-muted-foreground">For resolved errors</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <CardDescription>Errors per 1000 sessions</CardDescription>
          </div>
          {errorRateChange > 0 ? (
            <ArrowUpIcon className="h-4 w-4 text-destructive" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-green-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{errorRate.toFixed(1)}</div>
          <div className="flex items-center text-xs">
            <span
              className={
                errorRateChange > 0
                  ? "text-destructive"
                  : errorRateChange < 0
                    ? "text-green-500"
                    : "text-muted-foreground"
              }
            >
              {errorRateChange > 0 ? "+" : ""}
              {errorRateChange.toFixed(1)}% from last week
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Affected Users</CardTitle>
            <CardDescription>Users experiencing errors</CardDescription>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{affectedUsers}</div>
          <p className="text-xs text-muted-foreground">Across all applications</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Resolved (24h)</CardTitle>
            <CardDescription>Errors resolved today</CardDescription>
          </div>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolvedLast24h}</div>
          <p className="text-xs text-muted-foreground">In the last 24 hours</p>
        </CardContent>
      </Card>
    </div>
  )
}
