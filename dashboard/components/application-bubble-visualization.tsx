"use client"

import { useEffect, useRef, useState } from "react"

interface ApplicationData {
  id: string
  name: string
  category: string
  usageCount: number
  description: string
}

interface ApplicationBubbleVisualizationProps {
  applications: ApplicationData[]
}

export function ApplicationBubbleVisualization({ applications = [] }: ApplicationBubbleVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const chartInitialized = useRef(false)

  useEffect(() => {
    // Safety check for SSR
    if (typeof window === "undefined") return

    // Create a container for the chart
    if (!containerRef.current) return

    // Clear any previous content
    containerRef.current.innerHTML = ""

    // Set loading state
    setIsLoading(true)
    setError(null)

    // Function to load scripts
    const loadScripts = async () => {
      try {
        // Load G6 and D3 libraries directly in the component
        if (typeof window.G6 === "undefined") {
          await new Promise<void>((resolve, reject) => {
            const g6Script = document.createElement("script")
            g6Script.src = "https://unpkg.com/@antv/g6@5/dist/g6.min.js"
            g6Script.async = true
            g6Script.onload = () => resolve()
            g6Script.onerror = () => reject(new Error("Failed to load G6"))
            document.head.appendChild(g6Script)
          })
        }

        if (typeof window.d3 === "undefined") {
          await new Promise<void>((resolve, reject) => {
            const d3Script = document.createElement("script")
            d3Script.src = "https://d3js.org/d3-hierarchy.v2.min.js"
            d3Script.async = true
            d3Script.onload = () => resolve()
            d3Script.onerror = () => reject(new Error("Failed to load D3"))
            document.head.appendChild(d3Script)
          })
        }

        // Wait a moment to ensure scripts are fully initialized
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check if libraries are available
        if (typeof window.G6 === "undefined" || typeof window.d3 === "undefined") {
          throw new Error("Required libraries not loaded")
        }

        // Only run this effect when the script has loaded and container is available
        if (typeof window.G6 === "undefined" || !containerRef.current || chartInitialized.current) return

        chartInitialized.current = true

        // Ensure applications is an array
        if (!Array.isArray(applications)) {
          throw new Error("Applications data is not an array")
        }

        // Get all unique categories - with safety check
        const categories = Array.from(
          new Set(applications.filter((app) => app && typeof app.category === "string").map((app) => app.category)),
        )

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
            ...applications
              .filter((app) => app && app.id && app.category && categories.includes(app.category))
              .map((app, index) => ({
                id: app.id,
                text: app.name || "Unnamed App",
                depth: 2,
                actualParentId: app.category,
                id_num: index % 11, // For color variation
                index_value: app.usageCount || 1, // This will determine the size, default to 1
                description: app.description || "",
              })),
          ],
        }

        // Define color function
        function getColor(id: string | number) {
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
          const index = typeof id === "string" ? Number.parseInt(id) || 0 : id || 0
          return colors[index % colors.length]
        }

        // Define the bubble layout
        class BubbleLayout extends window.G6.BaseLayout {
          id = "bubble-layout"

          async execute(model: any, options: any) {
            const { nodes = [] } = model
            const { width = 0, height = 0 } = { ...this.options, ...options }

            const root = window.d3.hierarchy({ id: "root" }, (datum: any) => {
              const { id } = datum
              if (!id) return []
              if (id === "root") return nodes.filter((node: any) => node && node.depth === 1)
              else if (datum.depth === 1) return nodes.filter((node: any) => node && node.actualParentId === id)
              else return []
            })

            root.sum((d: any) => {
              const value = d && typeof d.index_value === "number" ? d.index_value : 0.01
              return value ** 0.5 * 100
            })

            window.d3
              .pack()
              .size([width, height])
              .padding((node: any) => {
                return node.depth === 0 ? 20 : 2
              })(root)

            const result = { nodes: [] }

            root.descendants().forEach((node: any) => {
              if (!node || !node.data) return

              const {
                data: { id },
                x,
                y,
                r,
              } = node

              if (node.depth >= 1 && id) {
                result.nodes.push({ id, style: { x, y, size: r * 2 } })
              }
            })

            return result
          }
        }

        // Register the layout
        window.G6.register(window.G6.ExtensionCategory.LAYOUT, "bubble-layout", BubbleLayout)

        // Create the graph
        const graph = new window.G6.Graph({
          container: containerRef.current,
          data: graphData,
          width: containerRef.current.clientWidth,
          height: 500,
          autoFit: true,
          node: {
            style: (d: any) => {
              if (!d) return {}

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

              const { text, style = {} } = d

              const diameter = style.size || 20

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
              getContent: (event: any, items: any) => {
                if (!items || !items.length || !items[0] || !items[0].id) {
                  return ""
                }

                const node = graphData.nodes.find((n: any) => n && n.id === items[0].id)
                if (node && node.depth === 2) {
                  return `
                    <div style="padding: 10px; background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                      <div style="font-weight: bold; margin-bottom: 5px;">${node.text || ""}</div>
                      <div style="font-size: 12px; color: #666;">${node.description || ""}</div>
                      <div style="font-size: 12px; margin-top: 5px;">
                        <strong>Usage:</strong> ${node.index_value || 0} PCs
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
          if (graph && typeof graph.destroy === "function") {
            graph.destroy()
          }
        }
      } catch (err) {
        console.error("Error initializing chart:", err)
        setError(err instanceof Error ? err.message : "Failed to load chart")
        setIsLoading(false)
      }
    }

    // Initialize the chart
    loadScripts()

    // Clean up function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [applications])

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-[500px] bg-white rounded-lg" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Loading visualization...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="text-center p-6">
            <p className="text-destructive font-semibold mb-2">Failed to load visualization</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <p className="text-sm">Showing alternative chart instead</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Add these types to make TypeScript happy with the global window object
declare global {
  interface Window {
    G6: any
    d3: any
  }
}
