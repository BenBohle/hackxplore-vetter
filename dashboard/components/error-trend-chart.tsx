"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ErrorTrendChartProps {
  data: {
    date: string
    new: number
    investigating: number
    resolved: number
    total: number
  }[]
}

export function ErrorTrendChart({ data }: ErrorTrendChartProps) {
  const [timeRange, setTimeRange] = useState("7days")
  const [chartType, setChartType] = useState("line")

  // Filter data based on selected time range
  const filteredData = (() => {
    const now = new Date()
    const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90
    const cutoff = new Date(now.setDate(now.getDate() - days))

    return data.filter((item) => new Date(item.date) >= cutoff)
  })()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Error Trends</CardTitle>
            <CardDescription>Error occurrences over time</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Tabs value={chartType} onValueChange={setChartType} className="w-[180px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            new: {
              label: "New",
              color: "hsl(var(--chart-1))",
            },
            investigating: {
              label: "Investigating",
              color: "hsl(var(--chart-2))",
            },
            resolved: {
              label: "Resolved",
              color: "hsl(var(--chart-3))",
            },
            total: {
              label: "Total",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="new" stroke="var(--color-new)" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="investigating" stroke="var(--color-investigating)" />
                <Line type="monotone" dataKey="resolved" stroke="var(--color-resolved)" />
                <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeDasharray="5 5" />
              </LineChart>
            ) : (
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="new" fill="var(--color-new)" />
                <Bar dataKey="investigating" fill="var(--color-investigating)" />
                <Bar dataKey="resolved" fill="var(--color-resolved)" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
