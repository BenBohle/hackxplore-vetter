"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface ApplicationData {
  id: string
  name: string
  category: string
  usageCount: number
  description: string
}

interface ApplicationBubbleChartProps {
  applications: ApplicationData[]
}

export function ApplicationBubbleChart({ applications }: ApplicationBubbleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Create a container for the chart
    if (!containerRef.current) return

    // Clear any previous content
    containerRef.current.innerHTML = ""

    // Set loading state
    setIsLoading(true)
    setError(null)

    // Function to load scripts sequentially
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
        document.head.appendChild(script)
      })
    }

    // Load required scripts and initialize chart
    const initializeChart = async () => {
      try {
        // Load G6 and D3 libraries
        await loadScript("https://gw.alipayobjects.com/os/lib/antv/g6/5.0.0-beta.4/dist/g6.min.js")
        await loadScript("https://d3js.org/d3-hierarchy.v2.min.js")

        // Make sure the libraries are available
        if (!window.G6 || !window.d3) {
          throw new Error("Required libraries not loaded")
        }

        // Get all unique categories
        const categories = Array.from(new Set(applications.map((app) => app.category)))

        // Prepare data for G6
        const graphData = {
          nodes: [
            // Add root node
            { id: "root", depth: 0 },
            // Add category nodes
            ...categories.map((category, index) => ({
              id: category,
              depth: 1,
              id_num: index,
            })),
            // Add application nodes
            ...applications.map((app, index) => ({
              id: app.id,
              text: app.name,
              depth: 2,
              actualParentId: app.category,
              id_num: index % 11, // For color variation
              index_value: app.usageCount, // This will determine the size
              description: app.description,
            })),
          ],
        }

        // Define the bubble layout
        class BubbleLayout extends window.G6.BaseLayout {
          id = "bubble-layout"

          async execute(model, options) {
            const { nodes = [] } = model
            const { width = 0, height = 0 } = { ...this.options, ...options }

            const root = window.d3.hierarchy({ id: "root" }, (datum) => {
              const { id } = datum
              if (id === "root") return nodes.filter((node) => node.depth === 1)
              else if (datum.depth === 1) return nodes.filter((node) => node.actualParentId === id)
              else return []
            })

            root.sum((d) => (+d.index_value || 0.01) ** 0.5 * 100)

            window.d3
              .pack()
              .size([width, height])
              .padding((node) => {
                return node.depth === 0 ? 20 : 2
              })(root)

            const result = { nodes: [] }

            root.descendants().forEach((node) => {
              const {
                data: { id },
                x,
                y,
                r,
              } = node

              if (node.depth >= 1) result.nodes.push({ id, style: { x, y, size: r * 2 } })
            })

            return result
          }
        }

        // Register the layout
        window.G6.register(window.G6.ExtensionCategory.LAYOUT, "bubble-layout", BubbleLayout)

        // Color function
        function getColor(id) {
          const colors = [
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
          const index = Number.parseInt(id)
          return colors[index % colors.length]
        }

        // Create the graph
        const graph = new window.G6.Graph({
          container: containerRef.current,
          data: graphData,
          width: containerRef.current.clientWidth,
          height: 500,
          autoFit: true,
          node: {
            style: (d) => {
              const { id, depth, id_num } = d
              const color = getColor(id_num)

              if (depth === 1) {
                return {
                  fill: "none",
                  stroke: color,
                  labelFontFamily: "system-ui, sans-serif",
                  labelFontSize: 20,
                  labelText: id,
                  labelTextTransform: "capitalize",
                  lineWidth: 1,
                  zIndex: -1,
                }
              }

              const {
                text,
                style: { size: diameter },
              } = d

              return {
                fill: color,
                fillOpacity: 0.7,
                stroke: color,
                lineWidth: 1,
                labelFontFamily: "system-ui, sans-serif",
                labelFontSize: diameter > 40 ? 14 : 0,
                labelText: diameter > 40 ? text : "",
                labelPosition: "center",
                labelFill: "#fff",
              }
            },
          },
          layout: {
            type: "bubble-layout",
            preLayout: true,
          },
          plugins: [
            {
              type: "tooltip",
              getContent: (event, items) => {
                const node = graphData.nodes.find((n) => n.id === items[0].id)
                if (node && node.depth === 2) {
                  return `
                    <div style="padding: 10px; background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                      <div style="font-weight: bold; margin-bottom: 5px;">${node.text}</div>
                      <div style="font-size: 12px; color: #666;">${node.description || ""}</div>
                      <div style="font-size: 12px; margin-top: 5px;">
                        <strong>Usage:</strong> ${node.index_value} PCs
                      </div>
                    </div>
                  `
                }
                return `<div style="padding: 5px; background: white; border-radius: 4px;">${items[0].id}</div>`
              },
            },
          ],
          behaviors: [
            { type: "drag-canvas", enable: true },
            { type: "zoom-canvas", enable: true },
          ],
        })

        // Render the graph
        graph.render()

        // Handle resize
        const resizeObserver = new ResizeObserver(() => {
          if (containerRef.current) {
            graph.changeSize(containerRef.current.clientWidth, 500)
          }
        })

        if (containerRef.current) {
          resizeObserver.observe(containerRef.current)
        }

        // Set loading state to false
        setIsLoading(false)

        // Clean up function
        return () => {
          resizeObserver.disconnect()
          graph.destroy()
        }
      } catch (err) {
        console.error("Error initializing chart:", err)
        setError(err instanceof Error ? err.message : "Failed to load chart")
        setIsLoading(false)
      }
    }

    // Initialize the chart
    initializeChart()

    // Clean up function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [applications])

  return (
    <Card>
      <CardContent className="p-6">
        {isLoading && (
          <div className="flex justify-center items-center h-[500px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-[500px] text-destructive">
            <div className="text-center">
              <p className="font-semibold">Failed to load chart</p>
              <p className="text-sm mt-2">{error}</p>
              <p className="text-sm mt-4">Please try refreshing the page</p>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className="w-full h-[500px]"
          style={{ display: isLoading || error ? "none" : "block" }}
        />
      </CardContent>
    </Card>
  )
}

// Add these types to make TypeScript happy with the global window object
declare global {
  interface Window {
    G6: any
    d3: any
  }
}
