"use client"

import { useState, useEffect } from "react"
import { motion, Reorder } from "framer-motion"
import { Plus, GripVertical, Trash2, Check, Clock, Flag, Calendar, Bell, X, Edit } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

type Priority = "P1" | "P2" | "P3"

interface Task {
  id: string
  title: string
  priority: Priority
  dueTime?: string
  completed: boolean
  createdAt: number
  description?: string
  deadline?: string
  reminders?: string[]
}

export default function DailyPlanner() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskTime, setNewTaskTime] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("P2")

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editDeadline, setEditDeadline] = useState("")
  const [editDueTime, setEditDueTime] = useState("")
  const [editPriority, setEditPriority] = useState<Priority>("P2")
  const [editReminders, setEditReminders] = useState<string[]>([])
  const [newReminder, setNewReminder] = useState("")

  useEffect(() => {
    const savedTasks = localStorage.getItem("tyler-tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem("tyler-tasks")) {
      localStorage.setItem("tyler-tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: newTaskPriority,
      dueTime: newTaskTime || undefined,
      completed: false,
      createdAt: Date.now(),
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle("")
    setNewTaskTime("")
    setNewTaskPriority("P2")
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description || "")
    setEditDeadline(task.deadline || "")
    setEditDueTime(task.dueTime || "")
    setEditPriority(task.priority)
    setEditReminders(task.reminders || [])
    setIsModalOpen(true)
  }

  const saveTaskDetails = () => {
    if (!selectedTask) return

    setTasks(
      tasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              title: editTitle,
              description: editDescription,
              deadline: editDeadline || undefined,
              dueTime: editDueTime || undefined,
              priority: editPriority,
              reminders: editReminders.length > 0 ? editReminders : undefined,
            }
          : task,
      ),
    )

    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const addReminder = () => {
    if (!newReminder) return
    setEditReminders([...editReminders, newReminder])
    setNewReminder("")
  }

  const removeReminder = (index: number) => {
    setEditReminders(editReminders.filter((_, i) => i !== index))
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "P1":
        return "text-red-500 border-red-500/30 bg-red-500/10"
      case "P2":
        return "text-primary border-primary/30 bg-primary/10"
      case "P3":
        return "text-blue-500 border-blue-500/30 bg-blue-500/10"
    }
  }

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  const stats = {
    total: tasks.length,
    completed: completedTasks.length,
    p1: activeTasks.filter((t) => t.priority === "P1").length,
    p2: activeTasks.filter((t) => t.priority === "P2").length,
    p3: activeTasks.filter((t) => t.priority === "P3").length,
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance">Daily Planner</h2>
          <p className="text-muted-foreground mt-1">Organize your day with priorities and time blocks</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass p-4">
          <p className="text-sm text-muted-foreground">Total Tasks</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </Card>
        <Card className="glass p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-primary mt-1">{stats.completed}</p>
        </Card>
        <Card className="glass p-4 border-red-500/20">
          <p className="text-sm text-muted-foreground">P1 Tasks</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{stats.p1}</p>
        </Card>
        <Card className="glass p-4 border-primary/20">
          <p className="text-sm text-muted-foreground">P2 Tasks</p>
          <p className="text-2xl font-bold text-primary mt-1">{stats.p2}</p>
        </Card>
        <Card className="glass p-4 border-blue-500/20">
          <p className="text-sm text-muted-foreground">P3 Tasks</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{stats.p3}</p>
        </Card>
      </div>

      {/* Add Task Form */}
      <Card className="glass-strong glow-emerald p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
        <div className="flex flex-col lg:flex-row gap-3">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Task title..."
            className="flex-1 bg-secondary border-border"
          />
          <Input
            type="time"
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
            className="w-full lg:w-32 bg-secondary border-border"
          />
          <div className="flex gap-2">
            {(["P1", "P2", "P3"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setNewTaskPriority(p)}
                className={`
                  px-4 py-2 rounded-lg border font-medium text-sm transition-all
                  ${newTaskPriority === p ? getPriorityColor(p) : "border-border bg-secondary text-muted-foreground"}
                `}
              >
                {p}
              </button>
            ))}
          </div>
          <Button onClick={addTask} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </Card>

      {/* Active Tasks */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Active Tasks</h3>
        {activeTasks.length === 0 ? (
          <Card className="glass p-8 text-center">
            <p className="text-muted-foreground">No active tasks. Add one above to get started!</p>
          </Card>
        ) : (
          <Reorder.Group
            axis="y"
            values={activeTasks}
            onReorder={(newOrder) => setTasks([...newOrder, ...completedTasks])}
            className="space-y-3"
          >
            {activeTasks.map((task) => (
              <Reorder.Item key={task.id} value={task}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="glass p-4 hover:border-primary/30 transition-all cursor-move">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTask(task.id)
                        }}
                        className="w-6 h-6 rounded border-2 border-border hover:border-primary flex items-center justify-center flex-shrink-0 transition-colors"
                      >
                        {task.completed && <Check className="w-4 h-4 text-primary" />}
                      </button>

                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openTaskDetails(task)}>
                        <p className="font-medium text-foreground">{task.title}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {task.dueTime && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{task.dueTime}</span>
                            </div>
                          )}
                          {task.deadline && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(task.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                          {task.reminders && task.reminders.length > 0 && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Bell className="w-3 h-3" />
                              <span>{task.reminders.length}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-lg border text-sm font-medium flex items-center gap-1 ${getPriorityColor(task.priority)}`}
                      >
                        <Flag className="w-3 h-3" />
                        {task.priority}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTask(task.id)
                        }}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-muted-foreground">Completed</h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <motion.div key={task.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="glass p-4 opacity-60">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="w-6 h-6 rounded border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0"
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-muted-foreground line-through">{task.title}</p>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-strong max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Task Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title..."
                className="bg-secondary border-border"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Description</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add detailed notes about this task..."
                className="bg-secondary border-border min-h-[120px]"
              />
            </div>

            {/* Priority and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Priority</label>
                <div className="flex gap-2">
                  {(["P1", "P2", "P3"] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setEditPriority(p)}
                      className={`
                        flex-1 px-4 py-2 rounded-lg border font-medium text-sm transition-all
                        ${editPriority === p ? getPriorityColor(p) : "border-border bg-secondary text-muted-foreground"}
                      `}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Due Time</label>
                <Input
                  type="time"
                  value={editDueTime}
                  onChange={(e) => setEditDueTime(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Deadline</label>
              <Input
                type="date"
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>

            {/* Reminders */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Reminders</label>
              <div className="space-y-3">
                {editReminders.map((reminder, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border flex items-center gap-2">
                      <Bell className="w-4 h-4 text-primary" />
                      <span className="text-sm">{new Date(reminder).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => removeReminder(index)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Input
                    type="datetime-local"
                    value={newReminder}
                    onChange={(e) => setNewReminder(e.target.value)}
                    className="flex-1 bg-secondary border-border"
                  />
                  <Button onClick={addReminder} variant="outline" className="border-primary/30 bg-transparent">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={saveTaskDetails}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Changes
              </Button>
              <Button onClick={() => setIsModalOpen(false)} variant="outline" className="border-border">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
