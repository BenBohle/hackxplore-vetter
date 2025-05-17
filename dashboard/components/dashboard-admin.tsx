import { DashboardLayout } from "@/components/dashboard-layout"
import { ApplicationCard } from "@/components/application-card"
import { ErrorTrackingTable } from "@/components/error-tracking-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApplicationUsageChart } from "@/components/application-usage-chart"
import { applicationData } from "@/lib/application-data"
import { AdminDashboardClient } from "@/components/admin-dashboard-client"
import { errorData } from "@/lib/error-data"
import { AddApplicationModal } from "@/components/add-application-modal"

export function AdminDashboardPage() {
  const applications = applicationData
  const errors = errorData

  return (
      <DashboardLayout userRole="admin">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Monitor all applications and track errors across the organization.
            </p>
          </div>
  
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Applications</CardTitle>
                <CardDescription>All registered applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{applications.length}</div>
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Errors</CardTitle>
                <CardDescription>Errors requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{errors.filter((e) => e.status !== "resolved").length}</div>
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Critical Issues</CardTitle>
                <CardDescription>High priority errors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-destructive">
                  {errors.filter((e) => e.severity === "critical").length}
                </div>
              </CardContent>
            </Card>
          </div>
  
          <Tabs defaultValue="applications">
            <TabsList>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="errors">Error Tracking</TabsTrigger>
              <TabsTrigger value="usage-map">Usage Map</TabsTrigger>
            </TabsList>
  
            <TabsContent value="applications" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">All Applications</h2>
                <AddApplicationModal />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {applications.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            </TabsContent>
  
            <TabsContent value="errors" className="mt-6">
              <ErrorTrackingTable errors={errors} userRole="admin" />
            </TabsContent>
  
            <TabsContent value="usage-map" className="mt-6">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Application Usage Distribution</h2>
                  <p className="text-muted-foreground mb-6">
                    Visual breakdown of application usage across the organization
                  </p>
                  <ApplicationUsageChart applications={applications} />
                </div>
  
                <div>
                  <h2 className="text-xl font-semibold mb-2">Application Bubble Visualization</h2>
                  <p className="text-muted-foreground mb-6">
                    Interactive bubble visualization showing applications grouped by category, with bubble size
                    representing usage
                  </p>
                  <AdminDashboardClient applications={applications} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    )
}