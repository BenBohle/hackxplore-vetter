"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, MoveUp, MoveDown, Save } from "lucide-react"

interface ReproductionStep {
  id: string
  description: string
  expected?: string
  actual?: string
}

interface ErrorReproductionStepsProps {
  errorId: string
  initialSteps?: ReproductionStep[]
  readOnly?: boolean
}

export function ErrorReproductionSteps({ errorId, initialSteps = [], readOnly = false }: ErrorReproductionStepsProps) {
  const [steps, setSteps] = useState<ReproductionStep[]>(initialSteps)
  const [editMode, setEditMode] = useState(initialSteps.length === 0 && !readOnly)

  const addStep = () => {
    const newStep: ReproductionStep = {
      id: `step-${Date.now()}`,
      description: "",
    }
    setSteps([...steps, newStep])
  }

  const updateStep = (id: string, field: keyof ReproductionStep, value: string) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, [field]: value } : step)))
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  const moveStep = (id: string, direction: "up" | "down") => {
    const index = steps.findIndex((step) => step.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === steps.length - 1)) {
      return
    }

    const newSteps = [...steps]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const step = newSteps[index]
    newSteps.splice(index, 1)
    newSteps.splice(newIndex, 0, step)
    setSteps(newSteps)
  }

  const saveSteps = () => {
    // In a real application, you would call an API to save the steps
    console.log("Saving steps for error", errorId, steps)
    setEditMode(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reproduction Steps</CardTitle>
            <CardDescription>Steps to reproduce this error</CardDescription>
          </div>
          {!readOnly && (
            <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel" : steps.length > 0 ? "Edit" : "Add Steps"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {steps.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {readOnly
              ? "No reproduction steps have been added yet."
              : "No reproduction steps have been added yet. Click 'Add Steps' to add some."}
          </div>
        ) : (
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {editMode && (
                  <div className="absolute -left-10 top-0 flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveStep(step.id, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                      <span className="sr-only">Move up</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveStep(step.id, "down")}
                      disabled={index === steps.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                      <span className="sr-only">Move down</span>
                    </Button>
                  </div>
                )}
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Step {index + 1}</h3>
                    {editMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeStep(step.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove step</span>
                      </Button>
                    )}
                  </div>
                  {editMode ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <Textarea
                          value={step.description}
                          onChange={(e) => updateStep(step.id, "description", e.target.value)}
                          placeholder="Describe the step to reproduce the error..."
                          className="resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Expected Result</label>
                          <Input
                            value={step.expected || ""}
                            onChange={(e) => updateStep(step.id, "expected", e.target.value)}
                            placeholder="What should happen..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Actual Result</label>
                          <Input
                            value={step.actual || ""}
                            onChange={(e) => updateStep(step.id, "actual", e.target.value)}
                            placeholder="What actually happens..."
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>{step.description}</p>
                      {(step.expected || step.actual) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-sm">
                          {step.expected && (
                            <div>
                              <span className="font-medium">Expected: </span>
                              {step.expected}
                            </div>
                          )}
                          {step.actual && (
                            <div>
                              <span className="font-medium">Actual: </span>
                              {step.actual}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {editMode && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={addStep}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
          {steps.length > 0 && (
            <Button onClick={saveSteps}>
              <Save className="h-4 w-4 mr-2" />
              Save Steps
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
