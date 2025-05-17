import { DashboardLayout } from "@/components/dashboard-layout"
import { ApplicationCard } from "@/components/application-card"
import { ErrorTrackingTable } from "@/components/error-tracking-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { applicationData } from "@/lib/application-data"
import { errorData } from "@/lib/error-data"

interface UserDashboardPageProps {
  userName: string
  userApplications?: typeof applicationData
  userErrors?: typeof errorData
}

export function UserDashboardPage({ userName, userApplications, userErrors }: UserDashboardPageProps) {
  // Optional: Wenn du die Filterung hier machen willst:
  const apps = userApplications ?? applicationData.filter((app) => ["Customer Service", "Finance"].includes(app.category))
  const errors = userErrors ?? errorData.filter((error) => error.user === userName)

  return (
    <DashboardLayout userRole="user">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Monitor your applications and track errors on your devices.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Applications on your devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{apps.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>My Errors</CardTitle>
              <CardDescription>Errors on your devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{errors.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications">
          <TabsList>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="errors">My Errors</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {apps.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="errors" className="mt-6">
            <ErrorTrackingTable errors={errors} userRole="user" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}