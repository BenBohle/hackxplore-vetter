"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, ArrowUpDown, Laptop, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ErrorDetailModal } from "./error-detail-modal"
import { supabase } from "@/lib/supabaseClient"

interface ErrorTrackingTableProps {
  errors?: any[] // Now optional, but will be ignored in favor of Supabase data
  userRole: "admin" | "user"
}

export function ErrorTrackingTable({ userRole }: ErrorTrackingTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedError, setSelectedError] = useState<any | null>(null)
  const [errors, setErrors] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const fetchErrors = async () => {
      setLoading(true)
      setFetchError(null)
      const { data, error } = await supabase
        .from("errors")
        .select("*")
        .order("timestamp", { ascending: false })
      console.log("Supabase fetch result:", { data, error })
      if (error) {
        setFetchError("Failed to fetch errors")
        setErrors([])
      } else {
        setErrors(data || [])
        if (Array.isArray(data) && data.length === 0) {
          console.warn("Supabase returned an empty array. Check if your table has data and your RLS policies.")
        }
      }
      setLoading(false)
    }
    fetchErrors()
  }, [])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedErrors = [...errors].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }
    return 0
  })

  const severityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  }

  const statusVariants = {
    new: "default",
    investigating: "warning",
    resolved: "success",
  } as const

  return (
    <>
      <div className="rounded-md border">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : fetchError ? (
          <div className="p-8 text-center text-red-500">{fetchError}</div>
        ) : errors.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No error records found.<br />
            <span className="text-xs text-muted-foreground">
              (Check your Supabase table, table name, and RLS policies.)
            </span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("ticketId")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Ticket ID
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("device")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Device
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                {userRole === "admin" && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("user")}
                      className="flex items-center gap-1 font-medium"
                    >
                      User
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                )}
                <TableHead className="max-w-[300px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("errorMessage")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Error
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("timestamp")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Time
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("severity")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Severity
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Status
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedErrors.map((error) => (
                <TableRow
                  key={error.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedError(error)}
                >
                  <TableCell className="font-mono text-xs">{error.ticketId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-muted-foreground" />
                      <span>{error.device}</span>
                    </div>
                  </TableCell>
                  {userRole === "admin" && <TableCell>{error.user}</TableCell>}
                  <TableCell className="max-w-[300px] truncate">
                    <span className="font-medium">{error.errorMessage}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{error.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${severityColors[error.severity]}`} />
                      <span className="capitalize text-sm">{error.severity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[error.status]}>{error.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedError(error)
                        }}
                      >
                        <Bot className="h-3 w-3" />
                        <span className="text-xs">Details</span>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedError(error)
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          {userRole === "admin" && (
                            <>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Assign</DropdownMenuItem>
                              {error.status !== "resolved" && (
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  Mark as {error.status === "new" ? "Investigating" : "Resolved"}
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {selectedError && (
        <ErrorDetailModal
          {...selectedError}
          open={!!selectedError}
          onOpenChange={(open) => {
            if (!open) setSelectedError(null)
          }}
          userRole={userRole}
        />
      )}
    </>
  )
}
