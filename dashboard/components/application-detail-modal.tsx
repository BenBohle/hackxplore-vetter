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
import { AlertTriangle, Bot, Building, ExternalLink, Globe, Mail, Phone, User } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface ContactPerson {
  name: string
  email: string
  phone: string
}

interface Company {
  name: string
  website: string
  supportEmail: string
  supportPhone: string
}

interface RecentIssue {
  date: string
  count: number
}

interface ApplicationDetailProps {
  id: string
  name: string
  description: string
  logo: string
  status: string
  errorCount: number
  lastUpdated: string
  category: string
  usageCount: number
  isExternal: boolean
  contactPerson: ContactPerson
  company?: Company
  recentIssues: RecentIssue[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplicationDetailModal({
  id,
  name,
  description,
  logo,
  status,
  errorCount,
  lastUpdated,
  category,
  usageCount,
  isExternal,
  contactPerson,
  company,
  recentIssues,
  open,
  onOpenChange,
}: ApplicationDetailProps) {
  const [ activeTab, setActiveTab ] = useState("overview")
  const [ showAiDialog, setShowAiDialog ] = useState(false)
  const [ showReportDialog, setShowReportDialog ] = useState(false)

  const statusColors = {
    healthy: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  }

  const totalIssues = recentIssues.reduce((sum, issue) => sum + issue.count, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isExternal && (
          <div className="absolute inset-x-0 top-0 bg-orange-500 text-white py-1 px-4 text-center font-medium flex items-center justify-center">
            <ExternalLink className="h-4 w-4 mr-2" />
            External Software
          </div>
        )}

        <div className={isExternal ? "mt-6" : ""}>
          <DialogHeader className="flex flex-row items-start gap-4 pb-2">
            <div className="h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
              <img src={logo || "/placeholder.svg"} alt={`${name} logo`} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{name}</DialogTitle>
              <DialogDescription className="text-base mt-1">{description}</DialogDescription>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <div className={`h-2.5 w-2.5 rounded-full ${statusColors[ status as keyof typeof statusColors ]}`} />
                  <span className="text-sm font-medium capitalize">{status}</span>
                </div>
                <Badge variant={errorCount > 0 ? "destructive" : "outline"}>
                  {errorCount} {errorCount === 1 ? "error" : "errors"}
                </Badge>
                <Badge variant="secondary">{category}</Badge>
                <Badge variant="outline">{usageCount} PCs</Badge>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Contact Person</CardTitle>
                    <CardDescription>For troubleshooting and support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{contactPerson.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${contactPerson.email}`} className="text-blue-600 hover:underline">
                          {contactPerson.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${contactPerson.phone}`} className="text-blue-600 hover:underline">
                          {contactPerson.phone}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Application Details</CardTitle>
                    <CardDescription>General information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Usage:</span>
                        <span className="font-medium">{usageCount} PCs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-medium">{lastUpdated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{isExternal ? "External" : "Internal"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {isExternal && company && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Company Information
                    </CardTitle>
                    <CardDescription>External vendor details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{company.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {company.website}
                          </a>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${company.supportEmail}`} className="text-blue-600 hover:underline">
                            {company.supportEmail}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${company.supportPhone}`} className="text-blue-600 hover:underline">
                            {company.supportPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="issues" className="mt-4 space-y-4">
              <Card>
                <CardContent className="p-2">
                <CardTitle className="text-base">Recent Issues</CardTitle>
                </ CardContent>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ChartContainer
                      config={{
                        issues: {
                          label: "Issues",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <div className="aspect-[2.5/1] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={recentIssues}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(value) => {
                                const date = new Date(value)
                                return `${date.getMonth() + 1}/${date.getDate()}`
                              }}
                            />
                            <YAxis allowDecimals={false} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Line
                              type="monotone"
                              dataKey="count"
                              name="Issues"
                              stroke="var(--color-issues)"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                    </ChartContainer>
                  </div>



                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Card>
                      <CardContent className="p-2">
                        <div className="text-2xl font-bold">{totalIssues}</div>
                        <p className="text-sm text-muted-foreground">Total issues in last 5 days</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-2">
                        <div className="text-2xl font-bold">{(totalIssues / 5).toFixed(1)}</div>
                        <p className="text-sm text-muted-foreground">Average issues per day</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Support Options</CardTitle>
                  <CardDescription>Get help with this application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <User className="h-8 w-8 mb-2 text-primary" />
                        <h3 className="font-medium">Internal Contact</h3>
                        <p className="text-sm text-muted-foreground mb-2">{contactPerson.name}</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${contactPerson.email}`}>
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${contactPerson.phone}`}>
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {isExternal && company && (
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <Building className="h-8 w-8 mb-2 text-primary" />
                          <h3 className="font-medium">Vendor Support</h3>
                          <p className="text-sm text-muted-foreground mb-2">{company.name}</p>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`mailto:${company.supportEmail}`}>
                                <Mail className="h-4 w-4 mr-1" />
                                Email
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${company.supportPhone}`}>
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex space-x-2 mb-2 sm:mb-0">
            <Button variant="outline" onClick={() => setShowAiDialog(true)}>
              <Bot className="h-4 w-4 mr-2" />
              Ask AI
            </Button>
            <Button variant="default" onClick={() => setShowReportDialog(true)}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* AI Assistant Dialog */}
      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
            <DialogDescription>Ask questions about {name}</DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <p className="text-sm">
              How can I help you with {name}? You can ask about common issues, troubleshooting steps, or usage tips.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Type your question here..."
            />
            <Button type="submit">Ask</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Issue Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Issue</DialogTitle>
            <DialogDescription>Report a problem with {name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Issue Type
              </label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="error">Error Message</option>
                <option value="crash">Application Crash</option>
                <option value="performance">Performance Issue</option>
                <option value="feature">Feature Not Working</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Description
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Please describe the issue in detail..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Priority
              </label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
