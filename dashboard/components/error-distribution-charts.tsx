"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ErrorDistributionChartsProps {
  severityData: {
    name: string
    value: number
    color: string
  }[]
  categoryData: {
    name: string
    value: number
  }[]
}

export function ErrorDistributionCharts({ severityData, categoryData }: ErrorDistributionChartsProps) {
  // Colors for the category chart
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Errors by Severity</CardTitle>
          <CardDescription>Distribution of errors by severity level</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              ...Object.fromEntries(
                severityData.map((item) => [
                  item.name,
                  {
                    label: item.name,
                    color: item.color,
                  },
                ]),
              ),
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Errors by Application</CardTitle>
          <CardDescription>Distribution of errors by application</CardDescription>
        </CardHeader>
        <CardContent>
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
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
