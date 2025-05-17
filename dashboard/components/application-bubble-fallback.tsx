"use client"

import { ResponsiveContainer, Treemap, Tooltip } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

interface ApplicationData {
  id: string
  name: string
  category: string
  usageCount: number
  description: string
}

interface ApplicationBubbleFallbackProps {
  applications: ApplicationData[]
}

export function ApplicationBubbleFallback({ applications = [] }: ApplicationBubbleFallbackProps) {
  // Ensure applications is an array
  const safeApplications = Array.isArray(applications) ? applications : []

  // Transform data for treemap with safety checks
  const transformedData = safeApplications.reduce((acc, app) => {
    if (!app || !app.category) return acc

    const existingCategory = acc.find((item) => item.name === app.category)
    if (existingCategory) {
      existingCategory.children.push({
        name: app.name || "Unnamed App",
        size: app.usageCount || 1,
        description: app.description || "",
      })
    } else {
      acc.push({
        name: app.category,
        children: [
          {
            name: app.name || "Unnamed App",
            size: app.usageCount || 1,
            description: app.description || "",
          },
        ],
      })
    }
    return acc
  }, [] as any[])

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
    "#ffed6f",
  ]

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && payload[0] && payload[0].payload) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-md shadow-md border">
          <p className="font-semibold">{data.name || ""}</p>
          {data.description && <p className="text-sm text-muted-foreground">{data.description}</p>}
          {typeof data.size === "number" && (
            <p className="text-sm mt-1">
              <span className="font-medium">Usage:</span> {data.size} PCs
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardContent className="p-6">
        <ChartContainer className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={transformedData}
              dataKey="size"
              stroke="#fff"
              fill="#8884d8"
              aspectRatio={4 / 3}
              animationDuration={500}
              content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
                if (
                  !root ||
                  typeof x !== "number" ||
                  typeof y !== "number" ||
                  typeof width !== "number" ||
                  typeof height !== "number"
                ) {
                  return null
                }

                const categoryIndex = transformedData.findIndex((item) => item && item.name === root.name)
                return (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      style={{
                        fill: depth === 1 ? COLORS[index % COLORS.length] : COLORS[categoryIndex % COLORS.length],
                        stroke: "#fff",
                        strokeWidth: 2 / (depth + 1e-10),
                        strokeOpacity: 1 / (depth + 1e-10),
                      }}
                    />
                    {depth === 1 && width > 50 && height > 30 && name && (
                      <text
                        x={x + width / 2}
                        y={y + height / 2 + 7}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={14}
                        fontWeight="bold"
                      >
                        {name}
                      </text>
                    )}
                    {depth === 1 && root && root.name && (
                      <text
                        x={x + width / 2}
                        y={y + 20}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={16}
                        fontWeight="bold"
                      >
                        {root.name}
                      </text>
                    )}
                  </g>
                )
              }}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
