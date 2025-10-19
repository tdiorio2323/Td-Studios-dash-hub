"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CalendarIcon, Plus, ExternalLink, Sparkles, Circle, Trash2, Clock, Bell, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Task {
  id: string
  title: string
  completed: boolean
  priority: "P1" | "P2" | "P3"
  dueTime?: string
  description?: string
  deadline?: string
  reminders?: Array<{ id: string; datetime: string }>
}

interface Note {
  id: string
  content: string
  createdAt: string
}

export default function HomeOverview() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"P1" | "P2" | "P3">("P2")

  useEffect(() => {
    const savedTasks = localStorage.getItem("tyler-tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    const savedNotes = localStorage.getItem("tyler-quick-notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    setTasks(updatedTasks)
    localStorage.setItem("tyler-tasks", JSON.stringify(updatedTasks))
  }

  const addNote = () => {
    if (!newNote.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toISOString(),
    }

    const updatedNotes = [note, ...notes]
    setNotes(updatedNotes)
    localStorage.setItem("tyler-quick-notes", JSON.stringify(updatedNotes))
    setNewNote("")
  }

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    setNotes(updatedNotes)
    localStorage.setItem("tyler-quick-notes", JSON.stringify(updatedNotes))
  }

  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: newTaskPriority,
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    localStorage.setItem("tyler-tasks", JSON.stringify(updatedTasks))
    setNewTaskTitle("")
    setNewTaskPriority("P2")
    setShowAddTask(false)
  }

  const shortcuts = [
    { label: "Daily Planner", icon: CalendarIcon, color: "chrome" },
    { label: "File Vault", icon: ExternalLink, color: "blue" },
    { label: "Messages", icon: Sparkles, color: "purple" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const incompleteTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)
  const taskProgress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
          Welcome back, <span className="chrome-text">Tyler</span>
        </h1>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
      >
        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="sm:col-span-2">
          <Card className="glass-strong p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Today's Progress</span>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tasks</span>
                  <span className="text-foreground font-medium">
                    {completedTasks.length}/{tasks.length}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full chrome-gradient rounded-full glow-chrome transition-all duration-500"
                    style={{ width: `${taskProgress}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Focus Time</span>
                  <span className="text-foreground font-medium">4.5h</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full chrome-gradient rounded-full glow-chrome" style={{ width: "56%" }} />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants}>
          <Card className="glass p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold">Today's Tasks</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{incompleteTasks.length} remaining</span>
                <Button
                  size="sm"
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="chrome-gradient text-background hover:opacity-90 glow-chrome h-8 w-8 p-0"
                >
                  {showAddTask ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {showAddTask && (
              <div className="space-y-3 p-4 rounded-lg bg-secondary/50 border border-border">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTask()
                  }}
                  autoFocus
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    {(["P1", "P2", "P3"] as const).map((priority) => (
                      <button
                        key={priority}
                        onClick={() => setNewTaskPriority(priority)}
                        className={`text-xs px-3 py-1 rounded transition-all ${
                          newTaskPriority === priority
                            ? priority === "P1"
                              ? "bg-red-500/30 text-red-400 border border-red-500/50"
                              : priority === "P2"
                                ? "bg-yellow-500/30 text-yellow-400 border border-yellow-500/50"
                                : "bg-blue-500/30 text-blue-400 border border-blue-500/50"
                            : "bg-secondary text-muted-foreground border border-border hover:border-primary/30"
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={addTask}
                    className="chrome-gradient text-background hover:opacity-90 glow-chrome font-semibold"
                  >
                    Add Task
                  </Button>
                </div>
              </div>
            )}

            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No tasks yet. Add tasks in the Daily Planner.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {incompleteTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/50 transition-all group"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Circle className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{task.title}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            task.priority === "P1"
                              ? "bg-red-500/20 text-red-400"
                              : task.priority === "P2"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {task.dueTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.dueTime}
                          </span>
                        )}
                        {task.deadline && (
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                        {task.reminders && task.reminders.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Bell className="w-3 h-3" />
                            {task.reminders.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {incompleteTasks.length > 5 && (
                  <div className="text-center pt-2">
                    <span className="text-xs text-muted-foreground">+{incompleteTasks.length - 5} more tasks</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Notes & Shortcuts */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="glass p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold">Quick Notes</h3>
            </div>

            {/* Add new note */}
            <div className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Jot down quick thoughts..."
                className="w-full h-24 bg-secondary border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={addNote}
                  className="chrome-gradient text-background hover:opacity-90 glow-chrome font-semibold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Note
                </Button>
              </div>
            </div>

            {/* Display saved notes */}
            {notes.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-lg bg-secondary/50 border border-border/50 group hover:border-border transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm flex-1 whitespace-pre-wrap break-words">{note.content}</p>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Quick Shortcuts */}
        <motion.div variants={itemVariants}>
          <Card className="glass p-4 sm:p-6 space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Quick Access</h3>
            <div className="grid grid-cols-1 gap-3">
              {shortcuts.map((shortcut, index) => {
                const Icon = shortcut.icon
                return (
                  <button
                    key={index}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg chrome-gradient flex items-center justify-center group-hover:glow-chrome transition-all">
                      <Icon className="w-5 h-5 text-background" />
                    </div>
                    <span className="font-medium text-sm sm:text-base">{shortcut.label}</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                )
              })}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
