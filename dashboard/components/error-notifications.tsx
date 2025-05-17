"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, MessageSquare, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

export function ErrorNotifications() {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [slackEnabled, setSlackEnabled] = useState(true)
  const [browserEnabled, setBrowserEnabled] = useState(true)
  const [emailAddress, setEmailAddress] = useState("admin@company.com")
  const [slackChannel, setSlackChannel] = useState("#error-alerts")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Configure how you receive error notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="channels">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="channels">Notification Channels</TabsTrigger>
            <TabsTrigger value="preferences">Notification Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="channels" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive error notifications via email</p>
                  </div>
                </div>
                <Switch id="email-notifications" checked={emailEnabled} onCheckedChange={setEmailEnabled} />
              </div>
              {emailEnabled && (
                <div className="ml-9 pl-4 border-l">
                  <Label htmlFor="email-address" className="text-sm font-medium mb-1 block">
                    Email Address
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="email-address"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="Enter email address"
                      className="max-w-md"
                    />
                    <Button variant="outline" size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-4">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="slack-notifications" className="font-medium">
                      Slack Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive error notifications in Slack</p>
                  </div>
                </div>
                <Switch id="slack-notifications" checked={slackEnabled} onCheckedChange={setSlackEnabled} />
              </div>
              {slackEnabled && (
                <div className="ml-9 pl-4 border-l">
                  <Label htmlFor="slack-channel" className="text-sm font-medium mb-1 block">
                    Slack Channel
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="slack-channel"
                      value={slackChannel}
                      onChange={(e) => setSlackChannel(e.target.value)}
                      placeholder="Enter Slack channel"
                      className="max-w-md"
                    />
                    <Button variant="outline" size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-4">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="browser-notifications" className="font-medium">
                      Browser Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive error notifications in your browser</p>
                  </div>
                </div>
                <Switch id="browser-notifications" checked={browserEnabled} onCheckedChange={setBrowserEnabled} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="preferences" className="space-y-4 pt-4">
            <div className="space-y-4">
              <h3 className="font-medium">Notification Triggers</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="new-error" defaultChecked />
                  <Label htmlFor="new-error" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    New Errors
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="critical-error" defaultChecked />
                  <Label htmlFor="critical-error" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Critical Errors
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="status-change" defaultChecked />
                  <Label htmlFor="status-change" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Status Changes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="error-resolved" defaultChecked />
                  <Label htmlFor="error-resolved" className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Error Resolved
                  </Label>
                </div>
              </div>

              <Separator />

              <h3 className="font-medium">Notification Frequency</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="immediate"
                    name="frequency"
                    defaultChecked
                    className="h-4 w-4 text-primary border-muted-foreground"
                  />
                  <Label htmlFor="immediate">Immediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="hourly-digest"
                    name="frequency"
                    className="h-4 w-4 text-primary border-muted-foreground"
                  />
                  <Label htmlFor="hourly-digest">Hourly digest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="daily-digest"
                    name="frequency"
                    className="h-4 w-4 text-primary border-muted-foreground"
                  />
                  <Label htmlFor="daily-digest">Daily digest</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
