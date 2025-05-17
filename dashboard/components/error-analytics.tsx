import { DashboardLayout } from "@/components/dashboard-layout"
import { ErrorTrendChart } from "@/components/error-trend-chart"
import { ErrorDistributionCharts } from "@/components/error-distribution-charts"
import { ErrorMetricsCards } from "@/components/error-metrics-cards"
import { TopErrorPatterns } from "@/components/top-error-patterns"
import { ErrorNotifications } from "@/components/error-notifications"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorReproductionSteps } from "@/components/error-reproduction-steps"


// Sample data for error trends
const errorTrendData = [
  { date: "2023-05-08", new: 5, investigating: 3, resolved: 2, total: 10 },
  { date: "2023-05-09", new: 7, investigating: 4, resolved: 3, total: 14 },
  { date: "2023-05-10", new: 4, investigating: 6, resolved: 5, total: 15 },
  { date: "2023-05-11", new: 6, investigating: 5, resolved: 7, total: 18 },
  { date: "2023-05-12", new: 8, investigating: 4, resolved: 6, total: 18 },
  { date: "2023-05-13", new: 5, investigating: 5, resolved: 8, total: 18 },
  { date: "2023-05-14", new: 7, investigating: 6, resolved: 4, total: 17 },
  { date: "2023-05-15", new: 9, investigating: 7, resolved: 5, total: 21 },
  { date: "2023-05-16", new: 6, investigating: 8, resolved: 7, total: 21 },
  { date: "2023-05-17", new: 4, investigating: 6, resolved: 9, total: 19 },
  { date: "2023-05-18", new: 5, investigating: 4, resolved: 8, total: 17 },
  { date: "2023-05-19", new: 7, investigating: 3, resolved: 6, total: 16 },
  { date: "2023-05-20", new: 8, investigating: 5, resolved: 4, total: 17 },
  { date: "2023-05-21", new: 6, investigating: 7, resolved: 5, total: 18 },
]

// Sample data for error distribution by severity
const severityData = [
  { name: "Critical", value: 5, color: "#ef4444" },
  { name: "High", value: 12, color: "#f97316" },
  { name: "Medium", value: 18, color: "#eab308" },
  { name: "Low", value: 8, color: "#3b82f6" },
]

// Sample data for error distribution by category
const categoryData = [
  { name: "Marketing Portal", value: 7 },
  { name: "Customer Dashboard", value: 12 },
  { name: "Inventory System", value: 15 },
  { name: "HR Portal", value: 3 },
  { name: "Finance App", value: 6 },
]

// Sample data for top error patterns
const errorPatterns = [
  {
    id: "pattern-1",
    pattern: "TypeError: Cannot read property 'data' of undefined",
    occurrences: 24,
    applications: ["Marketing Portal", "Customer Dashboard", "Finance App"],
    firstSeen: "2023-05-10",
    lastSeen: "2023-05-21",
    status: "increasing" as const,
  },
  {
    id: "pattern-2",
    pattern: "Failed to fetch data: Network error",
    occurrences: 18,
    applications: ["Customer Dashboard", "Inventory System"],
    firstSeen: "2023-05-08",
    lastSeen: "2023-05-20",
    status: "active" as const,
  },
  {
    id: "pattern-3",
    pattern: "Uncaught ReferenceError: chartData is not defined",
    occurrences: 15,
    applications: ["Finance App", "Marketing Portal"],
    firstSeen: "2023-05-12",
    lastSeen: "2023-05-19",
    status: "decreasing" as const,
  },
  {
    id: "pattern-4",
    pattern: "Database connection timeout after 30s",
    occurrences: 12,
    applications: ["HR Portal", "Inventory System"],
    firstSeen: "2023-05-14",
    lastSeen: "2023-05-21",
    status: "active" as const,
  },
  {
    id: "pattern-5",
    pattern: "Permission denied: Unable to access /var/log/app",
    occurrences: 8,
    applications: ["System Utilities"],
    firstSeen: "2023-05-15",
    lastSeen: "2023-05-18",
    status: "decreasing" as const,
  },
]

// Sample reproduction steps
const reproductionSteps = [
  {
    id: "step-1",
    description: "Log in to the Customer Dashboard application with a standard user account.",
    expected: "User should be logged in successfully",
    actual: "User is logged in successfully",
  },
  {
    id: "step-2",
    description: "Navigate to the 'Analytics' section by clicking on the Analytics tab in the main navigation.",
    expected: "Analytics page should load with charts and data",
    actual: "Analytics page loads but without any data",
  },
  {
    id: "step-3",
    description: "Click on the 'Generate Report' button at the top right of the page.",
    expected: "A modal should appear with report options",
    actual: "Error appears: 'TypeError: Cannot read property 'data' of undefined'",
  },
]

export function ErrorAnalyticsPage() {
  return (
    <DashboardLayout userRole="admin">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error Analytics</h1>
          <p className="mt-2 text-muted-foreground">
            Detailed metrics and analytics for error tracking and resolution.
          </p>
        </div>

        <ErrorMetricsCards
          totalErrors={43}
          activeErrors={21}
          criticalErrors={5}
          avgResolutionTime="4h 32m"
          errorRate={8.3}
          errorRateChange={-2.5}
          affectedUsers={87}
          resolvedLast24h={9}
        />

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Error Patterns</TabsTrigger>
            <TabsTrigger value="reproduction">Reproduction</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <ErrorTrendChart data={errorTrendData} />
            <ErrorDistributionCharts severityData={severityData} categoryData={categoryData} />
          </TabsContent>

          <TabsContent value="patterns" className="mt-6 space-y-6">
            <TopErrorPatterns patterns={errorPatterns} />
            <Card>
              <CardHeader>
                <CardTitle>Error Grouping</CardTitle>
                <CardDescription>Similar errors are automatically grouped to reduce noise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Error grouping visualization will be displayed here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reproduction" className="mt-6 space-y-6">
            <ErrorReproductionSteps errorId="err-2" initialSteps={reproductionSteps} readOnly={false} />
            <Card>
              <CardHeader>
                <CardTitle>Automated Testing</CardTitle>
                <CardDescription>Connect with testing tools to verify fixes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Automated testing integration will be displayed here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-6">
            <ErrorNotifications />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}