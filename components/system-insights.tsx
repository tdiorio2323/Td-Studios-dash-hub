"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Clock, Target, Calendar, Award, Flame, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export default function SystemInsights() {
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    hoursWorked: 0,
    currentStreak: 0,
    filesManaged: 0,
    messagesProcessed: 0,
  })

  useEffect(() => {
    // Calculate stats from localStorage
    const tasks = JSON.parse(localStorage.getItem("tyler-tasks") || "[]")
    const files = JSON.parse(localStorage.getItem("tyler-files") || "[]")
    const messages = JSON.parse(localStorage.getItem("tyler-messages") || "[]")

    const completedTasks = tasks.filter((t: { completed: boolean }) => t.completed).length
    const processedMessages = messages.filter(
      (m: { status: string }) => m.status === "read" || m.status === "archived",
    ).length

    // Simulate hours worked (in real app, would track actual time)
    const hoursWorked = completedTasks * 0.5

    // Calculate streak (simplified - in real app would check consecutive days)
    const currentStreak = Math.min(completedTasks, 7)

    setStats({
      tasksCompleted: completedTasks,
      hoursWorked: Math.round(hoursWorked * 10) / 10,
      currentStreak,
      filesManaged: files.length,
      messagesProcessed: processedMessages.length,
    })
  }, [])

  // Mock data for charts
  const weeklyTasksData = [
    { day: "Mon", completed: 8, total: 12 },
    { day: "Tue", completed: 12, total: 15 },
    { day: "Wed", completed: 10, total: 14 },
    { day: "Thu", completed: 15, total: 18 },
    { day: "Fri", completed: 11, total: 13 },
    { day: "Sat", completed: 6, total: 8 },
    { day: "Sun", completed: 4, total: 6 },
  ]

  const productivityData = [
    { time: "6AM", value: 20 },
    { time: "9AM", value: 65 },
    { time: "12PM", value: 85 },
    { time: "3PM", value: 75 },
    { time: "6PM", value: 45 },
    { time: "9PM", value: 25 },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-balance">System Insights</h2>
        <p className="text-muted-foreground mt-1">Analytics and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="glass-strong p-4 glow-emerald">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Tasks Completed</span>
            </div>
            <p className="text-3xl font-bold text-primary">{stats.tasksCompleted}</p>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>+12% this week</span>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Hours Worked</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.hoursWorked}h</p>
            <div className="flex items-center gap-1 text-xs text-blue-500 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>+8% this week</span>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium">Current Streak</span>
            </div>
            <p className="text-3xl font-bold text-orange-500">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground mt-2">days in a row</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium">Files Managed</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.filesManaged}</p>
            <p className="text-xs text-muted-foreground mt-2">total files</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Award className="w-4 h-4" />
              <span className="text-xs font-medium">Messages</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.messagesProcessed}</p>
            <p className="text-xs text-muted-foreground mt-2">processed</p>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Tasks Chart */}
        <Card className="glass-strong p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Weekly Task Completion</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyTasksData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="day" stroke="#737373" style={{ fontSize: "12px" }} />
              <YAxis stroke="#737373" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                  color: "#e5e5e5",
                }}
              />
              <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="total" fill="#262626" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Productivity Timeline */}
        <Card className="glass-strong p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Daily Productivity Pattern</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="time" stroke="#737373" style={{ fontSize: "12px" }} />
              <YAxis stroke="#737373" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                  color: "#e5e5e5",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="glass p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Achievements</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <p className="font-semibold text-foreground">Week Warrior</p>
            <p className="text-sm text-muted-foreground mt-1">Completed tasks 7 days in a row</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <p className="font-semibold text-foreground">Task Master</p>
            <p className="text-sm text-muted-foreground mt-1">Completed 50+ tasks</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
            <p className="font-semibold text-foreground">Early Bird</p>
            <p className="text-sm text-muted-foreground mt-1">Started work before 8 AM</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
