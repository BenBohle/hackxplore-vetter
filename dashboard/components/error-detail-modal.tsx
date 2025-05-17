"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Laptop,
  MessageSquare,
  MoreHorizontal,
  Server,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface StatusHistoryItem {
  status: string
  timestamp: string
  user: string
}

interface Comment {
  id: string
  user: string
  timestamp: string
  text: string
}

interface BrowserInfo {
  browser: string
  version: string
  os: string
}

interface ServerInfo {
  server: string
  version: string
  os: string
  php?: string
}

interface ErrorDetailProps {
  id: string
  ticketId: string
  device: string
  deviceId: string
  user: string
  userId: string
  errorMessage: string
  shortMessage: string
  fullMessage: string
  context: string
  stackTrace: string
  timestamp: string
  dateTime: string
  status: "new" | "investigating" | "resolved"
  severity: "low" | "medium" | "high" | "critical"
  application: string
  applicationId: string
  occurrences: number
  firstSeen: string
  lastSeen: string
  assignedTo: User | null
  statusHistory: StatusHistoryItem[]
  comments: Comment[]
  browserInfo?: BrowserInfo
  serverInfo?: ServerInfo
  affectedUsers: number
  resolution?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  userRole: "admin" | "user"
}

export function ErrorDetailModal({
  id,
  ticketId,
  device,
  deviceId,
  user,
  userId,
  errorMessage,
  shortMessage,
  fullMessage,
  context,
  stackTrace,
  timestamp,
  dateTime,
  status,
  severity,
  application,
  applicationId,
  occurrences,
  firstSeen,
  lastSeen,
  assignedTo,
  statusHistory,
  comments,
  browserInfo,
  serverInfo,
  affectedUsers,
  resolution,
  open,
  onOpenChange,
  userRole,
}: ErrorDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showStackTrace, setShowStackTrace] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [newStatus, setNewStatus] = useState<string>(status)
  const [showAiDialog, setShowAiDialog] = useState(false)

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleStatusChange = (value: string) => {
    setNewStatus(value as "new" | "investigating" | "resolved")
    // In a real application, you would call an API to update the status
    console.log(`Status changed to ${value}`)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return
    // In a real application, you would call an API to add the comment
    console.log(`New comment: ${newComment}`)
    setNewComment("")
  }

  const handleAssign = () => {
    // In a real application, you would open a user selection dialog
    console.log("Assign to user")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
    console.log("Copied to clipboard")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant={statusVariants[status]} className="px-3 py-1 text-xs">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${severityColors[severity]}`} />
              <span className="text-sm font-medium capitalize">{severity} Severity</span>
            </div>
          </div>
          <DialogTitle className="text-xl font-bold">
            {ticketId}: {shortMessage}
          </DialogTitle>
          <DialogDescription className="text-base" asChild>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1">
                <Laptop className="h-4 w-4 text-muted-foreground" />
                <span>{device}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{user}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{application}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{timestamp}</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Error Information</CardTitle>
                <CardDescription>Details about the error occurrence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium mb-2">Error Message</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(fullMessage)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span className="sr-only">Copy error message</span>
                    </Button>
                  </div>
                  <p className="text-sm font-mono whitespace-pre-wrap">{fullMessage}</p>
                </div>

                <Collapsible open={showStackTrace} onOpenChange={setShowStackTrace}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Stack Trace</h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1 h-7">
                        {showStackTrace ? (
                          <>
                            <ChevronUp className="h-3.5 w-3.5" />
                            <span className="text-xs">Hide</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3.5 w-3.5" />
                            <span className="text-xs">Show</span>
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="mt-2 rounded-md bg-muted p-4 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 absolute top-2 right-2"
                        onClick={() => copyToClipboard(stackTrace)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="sr-only">Copy stack trace</span>
                      </Button>
                      <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-60">{stackTrace}</pre>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Occurrence Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">First seen:</span>
                        <span>{formatDate(firstSeen)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last seen:</span>
                        <span>{formatDate(lastSeen)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Occurrences:</span>
                        <span>{occurrences}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Affected users:</span>
                        <span>{affectedUsers}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Environment</h3>
                    <div className="space-y-2 text-sm">
                      {browserInfo && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Browser:</span>
                            <span>
                              {browserInfo.browser} {browserInfo.version}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">OS:</span>
                            <span>{browserInfo.os}</span>
                          </div>
                        </>
                      )}
                      {serverInfo && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Server:</span>
                            <span>
                              {serverInfo.server} {serverInfo.version}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Server OS:</span>
                            <span>{serverInfo.os}</span>
                          </div>
                          {serverInfo.php && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">PHP Version:</span>
                              <span>{serverInfo.php}</span>
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Context:</span>
                        <span className="font-mono">{context}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {resolution && (
                  <div className="rounded-md bg-green-50 dark:bg-green-950 p-4 border border-green-200 dark:border-green-900">
                    <h3 className="font-medium text-green-800 dark:text-green-300 flex items-center gap-2 mb-2">
                      <Check className="h-4 w-4" />
                      Resolution
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-400">{resolution}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  {assignedTo ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={assignedTo.avatar || "/placeholder.svg"} alt={assignedTo.name} />
                        <AvatarFallback>
                          {assignedTo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{assignedTo.name}</div>
                        <div className="text-sm text-muted-foreground">{assignedTo.email}</div>
                      </div>
                      {userRole === "admin" && (
                        <Button variant="outline" size="sm" className="ml-auto" onClick={handleAssign}>
                          Reassign
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="text-sm text-muted-foreground mb-2">Not assigned</div>
                      {userRole === "admin" && (
                        <Button variant="outline" size="sm" onClick={handleAssign}>
                          <span className="h-4 w-4 mr-2" />
                          Assign
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      {userRole === "admin" ? (
                        <Select value={newStatus} onValueChange={handleStatusChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="investigating">Investigating</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge variant={statusVariants[status]}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowAiDialog(true)}>
                      <Bot className="h-4 w-4 mr-2" />
                      AI Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Device Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Device Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Device Name:</span>
                          <span>{device}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Device ID:</span>
                          <span className="font-mono">{deviceId}</span>
                        </div>
                        {browserInfo && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Operating System:</span>
                              <span>{browserInfo.os}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Browser:</span>
                              <span>
                                {browserInfo.browser} {browserInfo.version}
                              </span>
                            </div>
                          </>
                        )}
                        {serverInfo && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Server:</span>
                              <span>
                                {serverInfo.server} {serverInfo.version}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Server OS:</span>
                              <span>{serverInfo.os}</span>
                            </div>
                            {serverInfo.php && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">PHP Version:</span>
                                <span>{serverInfo.php}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">User Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">User Name:</span>
                          <span>{user}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">User ID:</span>
                          <span className="font-mono">{userId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Department:</span>
                          <span>{application.split(" ")[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Application Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application:</span>
                        <span>{application}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application ID:</span>
                        <span className="font-mono">{applicationId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Context:</span>
                        <span className="font-mono">{context}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Error Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Error ID:</span>
                        <span className="font-mono">{id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ticket ID:</span>
                        <span className="font-mono">{ticketId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">First Seen:</span>
                        <span>{formatDate(firstSeen)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Seen:</span>
                        <span>{formatDate(lastSeen)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Occurrences:</span>
                        <span>{occurrences}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Affected Users:</span>
                        <span>{affectedUsers}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Status History</CardTitle>
                <CardDescription>Timeline of status changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusHistory.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            item.status === "new"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                              : item.status === "investigating"
                                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
                                : "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
                          }`}
                        >
                          {item.status === "new" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : item.status === "investigating" ? (
                            <span className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                        {index < statusHistory.length - 1 && (
                          <div className="h-full w-0.5 bg-muted-foreground/20 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="font-medium capitalize">{item.status}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(item.timestamp)}</div>
                        </div>
                        <div className="text-sm mt-1">
                          Status changed to <span className="font-medium capitalize">{item.status}</span> by{" "}
                          <span className="font-medium">{item.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Comments</CardTitle>
                <CardDescription>Discussion and notes about this error</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No comments yet. Add the first comment below.
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {comment.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{comment.user}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</div>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))
                  )}

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex space-x-2 mb-2 sm:mb-0">
            {userRole === "admin" && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleAssign}>
                      <span className="h-4 w-4 mr-2" />
                      Assign
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyToClipboard(stackTrace)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Stack Trace
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View in Application
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Server className="h-4 w-4 mr-2" />
                      View Server Logs
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" onClick={() => setShowAiDialog(true)}>
                  <Bot className="h-4 w-4 mr-2" />
                  AI Analysis
                </Button>
              </>
            )}
            {status !== "resolved" && userRole === "admin" && (
              <Button
                variant={status === "new" ? "default" : "outline"}
                onClick={() => handleStatusChange(status === "new" ? "investigating" : "resolved")}
              >
                {status === "new" ? (
                  <>
                    <span className="h-4 w-4 mr-2" />
                    Start Investigation
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>

      {/* AI Analysis Dialog */}
      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Analysis</DialogTitle>
            <DialogDescription>AI-powered analysis for error {ticketId}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-muted p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <h4 className="font-medium">Error Analysis</h4>
              </div>
              <p className="text-sm">
                This appears to be a {severity} severity error in the application's rendering process. Based on the
                context, it's likely caused by an undefined property being accessed during component rendering.
              </p>
            </div>
            <div className="rounded-md bg-muted p-4">
              <h4 className="mb-2 font-medium">Potential Causes</h4>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Missing null check before accessing a property</li>
                <li>Race condition where data is accessed before it's available</li>
                <li>API response format changed but code wasn't updated</li>
                <li>Network request failed but error handling is incomplete</li>
              </ul>
            </div>
            <div className="rounded-md bg-muted p-4">
              <h4 className="mb-2 font-medium">Recommended Solution</h4>
              <p className="text-sm">
                Add proper null checking before accessing the property or implement default values. Check the component
                that renders at {context}.
              </p>
              <div className="mt-2 bg-background rounded-md p-3 text-sm font-mono">
                <pre>{`// Before
const value = data.property;

// After
const value = data?.property ?? defaultValue;`}</pre>
              </div>
            </div>
            <div className="rounded-md bg-muted p-4">
              <h4 className="mb-2 font-medium">Similar Issues</h4>
              <p className="text-sm">
                This error is similar to 3 other errors that have occurred in the past month. All were related to
                undefined properties in the same application.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAiDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
