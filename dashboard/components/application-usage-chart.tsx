"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ApplicationData {
  id: string
  name: string
  category: string
  usageCount: number
  description: string
}

interface ApplicationUsageChartProps {
  applications: ApplicationData[]
}

export function ApplicationUsageChart({ applications }: ApplicationUsageChartProps) {
  const [activeTab, setActiveTab] = useState<"category" | "application">("category")

  // Prepare data for category view
  const categoryData = applications.reduce(
    (acc, app) => {
      const existingCategory = acc.find((item) => item.name === app.category)
      if (existingCategory) {
        existingCategory.value += app.usageCount
      } else {
        acc.push({
          name: app.category,
          value: app.usageCount,
        })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  // Sort by value descending
  categoryData.sort((a, b) => b.value - a.value)

  // Prepare data for application view (top 10 by usage)
  const applicationData = [...applications]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 10)
    .map((app) => ({
      name: app.name,
      value: app.usageCount,
      category: app.category,
    }))

  // Colors for the chart
  const COLORS = [
    "#8dd3c7",
    "#bebada",
    "#fb8072",
    "#80b1d3",
    "#fdb462",
    "#b3de69",
    "#fccde5",
    "#d9d9d9",
    "#bc80bd",
    "#ccebc5",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Usage Distribution</CardTitle>
        <CardDescription>Number of PCs using each application or category</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "category" | "application")}>
          <TabsList className="mb-4">
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="application">Top Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="category">
            <ChartContainer
              config={{
                ...Object.fromEntries(
                  categoryData.map((item, index) => [
                    item.name,
                    {
                      label: item.name,
                      color: COLORS[index % COLORS.length],
                    },
                  ]),
                ),
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="application">
            <ChartContainer
              config={{
                ...Object.fromEntries(
                  applicationData.map((item, index) => [
                    item.name,
                    {
                      label: item.name,
                      color: COLORS[index % COLORS.length],
                    },
                  ]),
                ),
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applicationData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {applicationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} PCs`,
                      `${props.payload.name} (${props.payload.category})`,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
