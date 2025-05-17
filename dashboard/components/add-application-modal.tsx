"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function AddApplicationModal() {
  const [open, setOpen] = useState(false)
  const [isExternal, setIsExternal] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const applicationData = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      status: formData.get("status"),
      usageCount: Number(formData.get("usageCount")),
      isExternal,
      contactPerson: {
        name: formData.get("contactName"),
        email: formData.get("contactEmail"),
        phone: formData.get("contactPhone"),
      },
      ...(isExternal && {
        company: {
          name: formData.get("companyName"),
          website: formData.get("companyWebsite"),
          supportEmail: formData.get("supportEmail"),
          supportPhone: formData.get("supportPhone"),
        },
      }),
    }

    console.log("New application data:", applicationData)

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Application</DialogTitle>
            <DialogDescription>Fill in the details to add a new application to the system.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <h3 className="text-sm font-medium">Basic Information</h3>

              <div className="grid grid-cols-1 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="name">Application Name *</Label>
                  <Input id="name" name="name" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" name="description" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" required defaultValue="Productivity">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Communication">Communication</SelectItem>
                      <SelectItem value="Productivity">Productivity</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <RadioGroup defaultValue="healthy" name="status" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="healthy" id="status-healthy" />
                      <Label htmlFor="status-healthy" className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                        Healthy
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="warning" id="status-warning" />
                      <Label htmlFor="status-warning" className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
                        Warning
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="critical" id="status-critical" />
                      <Label htmlFor="status-critical" className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                        Critical
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="usageCount">Usage Count *</Label>
                  <Input id="usageCount" name="usageCount" type="number" min="0" required defaultValue="0" />
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <h3 className="text-sm font-medium">Contact Person</h3>

              <div className="grid grid-cols-1 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="contactName">Name *</Label>
                  <Input id="contactName" name="contactName" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contactPhone">Phone *</Label>
                  <Input id="contactPhone" name="contactPhone" required />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isExternal" checked={isExternal} onCheckedChange={setIsExternal} />
              <Label htmlFor="isExternal">External Application</Label>
            </div>

            {isExternal && (
              <div className="grid gap-3">
                <h3 className="text-sm font-medium">Company Information</h3>

                <div className="grid grid-cols-1 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input id="companyName" name="companyName" required={isExternal} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="companyWebsite">Website *</Label>
                    <Input id="companyWebsite" name="companyWebsite" type="url" required={isExternal} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="supportEmail">Support Email *</Label>
                    <Input id="supportEmail" name="supportEmail" type="email" required={isExternal} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="supportPhone">Support Phone *</Label>
                    <Input id="supportPhone" name="supportPhone" required={isExternal} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
