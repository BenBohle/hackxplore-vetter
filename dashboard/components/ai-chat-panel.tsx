"use client"

import { useState } from "react"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

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

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: input }])

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "I'll help you analyze that error. Could you provide more details about when it occurred and what steps led to it?",
        },
      ])
    }, 1000)

    setInput("")
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
      </ScrollArea>

      <div className="border-t p-4">
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
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
