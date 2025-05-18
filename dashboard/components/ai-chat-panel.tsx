"use client"

import { useState } from "react"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function AIChatPanel({ isOpen, onClose, className }: AIChatPanelProps) {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "Hello! I'm your AI assistant. How can I help you with error tracking today?",
    },
  ])
  const [input, setInput] = useState("")
  const [selectedApp, setSelectedApp] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // System prompt for Llama2
  const systemPrompt =
    "You are acting as an internal IT helpdesk assistant for a company. Your primary responsibility is to provide employees with clear, actionable, and technically sound recommendations for resolving common IT issues. Approach each problem methodically, using troubleshooting best practices. Offer concise, professional responses tailored to a business environment. If all troubleshooting options have been exhausted or if the issue is beyond your capabilities, you must always conclude by advising the user to contact their IT department for further assistance."

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setLoading(true)

    // Compose prompt for Llama2
    const appPart = selectedApp ? `Application: ${selectedApp}\n` : ""
    const userPrompt = `${appPart}User: ${input}`

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama2-uncensored:latest",
          stream: false,
          prompt: `${systemPrompt}\n${userPrompt}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to connect to Ollama API")
      }

      const data = await response.json()
      // Ollama returns { response: "...", ... }
      const aiContent = data.response || "Sorry, I couldn't generate a response."

      setMessages((prev) => [
        ...prev,
        { role: "system", content: aiContent },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Error: Could not connect to AI backend." },
      ])
    } finally {
      setLoading(false)
      setInput("")
    }
  }

  return (
    <div suppressHydrationWarning className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-semibold">AI Assistant</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div key={i} className={cn("flex items-start gap-3", message.role === "user" && "justify-end")}>
              {message.role === "system" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/ai-robot.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.role === "system" ? "bg-muted" : "bg-primary text-primary-foreground",
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
        {loading && (
          <div className="flex justify-center mt-4">
            <span className="text-xs text-muted-foreground">AI is thinking...</span>
          </div>
        )}
      </ScrollArea>
      <div className="border-t p-4">
        {/* Better dropdown for application selection */}
        <div className="mb-2">
          <Select value={selectedApp} onValueChange={setSelectedApp}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Application" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
              <SelectItem value="Chrome">Chrome</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
        >
          <Input
            placeholder="Ask about errors..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
