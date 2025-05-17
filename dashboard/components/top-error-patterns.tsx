"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ErrorPattern {
  id: string
  pattern: string
  occurrences: number
  applications: string[]
  firstSeen: string
  lastSeen: string
  status: "active" | "decreasing" | "increasing"
}

interface TopErrorPatternsProps {
  patterns: ErrorPattern[]
}

export function TopErrorPatterns({ patterns }: TopErrorPatternsProps) {
  const statusColors = {
    active: "bg-blue-500",
    decreasing: "bg-green-500",
    increasing: "bg-red-500",
  }

  const statusLabels = {
    active: "Active",
    decreasing: "Decreasing",
    increasing: "Increasing",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Error Patterns</CardTitle>
        <CardDescription>Most common error patterns across applications</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Error Pattern</TableHead>
              <TableHead className="w-[100px] text-right">Occurrences</TableHead>
              <TableHead className="w-[150px]">Applications</TableHead>
              <TableHead className="w-[120px]">First Seen</TableHead>
              <TableHead className="w-[120px]">Last Seen</TableHead>
              <TableHead className="w-[100px]">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patterns.map((pattern) => (
              <TableRow key={pattern.id}>
                <TableCell className="font-medium">{pattern.pattern}</TableCell>
                <TableCell className="text-right">{pattern.occurrences}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {pattern.applications.slice(0, 2).map((app, i) => (
                      <Badge key={i} variant="outline" className="whitespace-nowrap">
                        {app}
                      </Badge>
                    ))}
                    {pattern.applications.length > 2 && (
                      <Badge variant="outline">+{pattern.applications.length - 2} more</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(pattern.firstSeen).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(pattern.lastSeen).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${statusColors[pattern.status]}`} />
                    <span className="text-sm">{statusLabels[pattern.status]}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
