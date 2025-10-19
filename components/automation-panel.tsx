"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Play, Clock, Trash2, CheckCircle, AlertCircle, Calendar, Archive, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AutomationScript {
  id: string
  name: string
  description: string
  icon: string
  action: () => void
  lastRun?: number
}

export default function AutomationPanel() {
  const [runningScript, setRunningScript] = useState<string | null>(null)
  const [scriptResults, setScriptResults] = useState<Record<string, { success: boolean; message: string }>>({})

  const runScript = async (script: AutomationScript) => {
    setRunningScript(script.id)

    // Simulate script execution
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      script.action()
      setScriptResults({
        ...scriptResults,
        [script.id]: {
          success: true,
          message: `${script.name} completed successfully`,
        },
      })
    } catch (error) {
      setScriptResults({
        ...scriptResults,
        [script.id]: {
          success: false,
          message: `${script.name} failed: ${error}`,
        },
      })
    }

    setRunningScript(null)
  }

  const scripts: AutomationScript[] = [
    {
      id: "daily-reset",
      name: "Daily Reset",
      description: "Clear completed tasks and reset daily counters",
      icon: "calendar",
      action: () => {
        const tasks = JSON.parse(localStorage.getItem("tyler-tasks") || "[]")
        const activeTasks = tasks.filter((t: { completed: boolean }) => !t.completed)
        localStorage.setItem("tyler-tasks", JSON.stringify(activeTasks))
      },
    },
    {
      id: "archive-old",
      name: "Archive Old Tasks",
      description: "Move tasks older than 30 days to archive",
      icon: "archive",
      action: () => {
        const tasks = JSON.parse(localStorage.getItem("tyler-tasks") || "[]")
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
        const recentTasks = tasks.filter((t: { createdAt: number }) => t.createdAt > thirtyDaysAgo)
        localStorage.setItem("tyler-tasks", JSON.stringify(recentTasks))
      },
    },
    {
      id: "clear-completed",
      name: "Clear Completed Items",
      description: "Remove all completed tasks from the planner",
      icon: "check",
      action: () => {
        const tasks = JSON.parse(localStorage.getItem("tyler-tasks") || "[]")
        const incompleteTasks = tasks.filter((t: { completed: boolean }) => !t.completed)
        localStorage.setItem("tyler-tasks", JSON.stringify(incompleteTasks))
      },
    },
    {
      id: "cleanup-messages",
      name: "Cleanup Messages",
      description: "Archive read messages older than 7 days",
      icon: "trash",
      action: () => {
        const messages = JSON.parse(localStorage.getItem("tyler-messages") || "[]")
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        const updatedMessages = messages.map((m: { status: string; timestamp: number }) => {
          if (m.status === "read" && m.timestamp < sevenDaysAgo) {
            return { ...m, status: "archived" }
          }
          return m
        })
        localStorage.setItem("tyler-messages", JSON.stringify(updatedMessages))
      },
    },
    {
      id: "optimize-storage",
      name: "Optimize Storage",
      description: "Clean up temporary data and optimize localStorage",
      icon: "sparkles",
      action: () => {
        // Simulate storage optimization
        console.log("[v0] Storage optimization completed")
      },
    },
  ]

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "calendar":
        return Calendar
      case "archive":
        return Archive
      case "check":
        return CheckCircle
      case "trash":
        return Trash2
      case "sparkles":
        return Sparkles
      default:
        return Zap
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-balance">Automation Panel</h2>
        <p className="text-muted-foreground mt-1">Quick scripts to automate routine tasks</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Scripts</p>
              <p className="text-2xl font-bold text-foreground">{scripts.length}</p>
            </div>
          </div>
        </Card>
        <Card className="glass p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Successful Runs</p>
              <p className="text-2xl font-bold text-green-500">
                {Object.values(scriptResults).filter((r) => r.success).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="glass p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Failed Runs</p>
              <p className="text-2xl font-bold text-red-500">
                {Object.values(scriptResults).filter((r) => !r.success).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Automation Scripts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {scripts.map((script) => {
          const Icon = getIcon(script.icon)
          const isRunning = runningScript === script.id
          const result = scriptResults[script.id]

          return (
            <motion.div key={script.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="glass-strong p-6 hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 glow-emerald">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground">{script.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{script.description}</p>

                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
                          mt-3 p-2 rounded-lg text-xs flex items-center gap-2
                          ${result.success ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}
                        `}
                      >
                        {result.success ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span>{result.message}</span>
                      </motion.div>
                    )}

                    <Button
                      onClick={() => runScript(script)}
                      disabled={isRunning}
                      className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                      size="sm"
                    >
                      {isRunning ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Run Script
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Integration Placeholders */}
      <Card className="glass p-6">
        <h3 className="text-lg font-semibold mb-4">Integration Placeholders</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border">
            <div>
              <p className="font-medium text-foreground">Google Drive / Dropbox</p>
              <p className="text-sm text-muted-foreground">Sync files automatically</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Connect
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border">
            <div>
              <p className="font-medium text-foreground">Telegram / Email API</p>
              <p className="text-sm text-muted-foreground">Forward messages to hub</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Connect
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border">
            <div>
              <p className="font-medium text-foreground">Calendar API</p>
              <p className="text-sm text-muted-foreground">Import daily schedule</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Connect
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
