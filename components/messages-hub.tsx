"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Bell, Mail, Search, Star, Trash2, Send, Plus, Filter, Archive, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type MessageCategory = "Direct" | "Reminder" | "Notification" | "System"
type MessageStatus = "unread" | "read" | "starred" | "archived"

interface Message {
  id: string
  title: string
  content: string
  category: MessageCategory
  status: MessageStatus
  timestamp: number
  sender?: string
}

export default function MessagesHub() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<MessageCategory | "All">("All")
  const [filterStatus, setFilterStatus] = useState<MessageStatus | "All">("All")
  const [newMessageTitle, setNewMessageTitle] = useState("")
  const [newMessageContent, setNewMessageContent] = useState("")
  const [showCompose, setShowCompose] = useState(false)

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("tyler-messages")
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      // Add some demo messages
      const demoMessages: Message[] = [
        {
          id: "1",
          title: "Welcome to Tyler Command Hub",
          content:
            "This is your unified inbox for messages, reminders, and notifications. You can create new messages, categorize them, and mark them as important.",
          category: "System",
          status: "unread",
          timestamp: Date.now() - 3600000,
          sender: "System",
        },
        {
          id: "2",
          title: "Daily Standup Reminder",
          content: "Don't forget your daily standup meeting at 10:00 AM",
          category: "Reminder",
          status: "unread",
          timestamp: Date.now() - 7200000,
          sender: "Calendar",
        },
      ]
      setMessages(demoMessages)
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0 || localStorage.getItem("tyler-messages")) {
      localStorage.setItem("tyler-messages", JSON.stringify(messages))
    }
  }, [messages])

  const createMessage = () => {
    if (!newMessageTitle.trim() || !newMessageContent.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      title: newMessageTitle,
      content: newMessageContent,
      category: "Direct",
      status: "unread",
      timestamp: Date.now(),
      sender: "Tyler Diorio",
    }

    setMessages([newMessage, ...messages])
    setNewMessageTitle("")
    setNewMessageContent("")
    setShowCompose(false)
  }

  const updateMessageStatus = (id: string, status: MessageStatus) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, status } : m)))
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, status })
    }
  }

  const deleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id))
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
  }

  const getCategoryColor = (category: MessageCategory) => {
    switch (category) {
      case "Direct":
        return "text-primary border-primary/30 bg-primary/10"
      case "Reminder":
        return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10"
      case "Notification":
        return "text-blue-500 border-blue-500/30 bg-blue-500/10"
      case "System":
        return "text-purple-500 border-purple-500/30 bg-purple-500/10"
    }
  }

  const getCategoryIcon = (category: MessageCategory) => {
    switch (category) {
      case "Direct":
        return MessageSquare
      case "Reminder":
        return Bell
      case "Notification":
        return Mail
      case "System":
        return AlertCircle
    }
  }

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "All" || msg.category === filterCategory
    const matchesStatus = filterStatus === "All" || msg.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const stats = {
    total: messages.length,
    unread: messages.filter((m) => m.status === "unread").length,
    starred: messages.filter((m) => m.status === "starred").length,
    archived: messages.filter((m) => m.status === "archived").length,
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-balance">Messages Hub</h2>
          <p className="text-muted-foreground mt-1">Unified inbox for all your communications</p>
        </div>
        <Button
          onClick={() => setShowCompose(!showCompose)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </Card>
        <Card className="glass p-4 border-primary/20">
          <p className="text-sm text-muted-foreground">Unread</p>
          <p className="text-2xl font-bold text-primary mt-1">{stats.unread}</p>
        </Card>
        <Card className="glass p-4 border-yellow-500/20">
          <p className="text-sm text-muted-foreground">Starred</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">{stats.starred}</p>
        </Card>
        <Card className="glass p-4 border-blue-500/20">
          <p className="text-sm text-muted-foreground">Archived</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{stats.archived}</p>
        </Card>
      </div>

      {/* Compose Message */}
      {showCompose && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-strong glow-emerald p-6 space-y-4">
            <h3 className="text-lg font-semibold">Compose Message</h3>
            <Input
              value={newMessageTitle}
              onChange={(e) => setNewMessageTitle(e.target.value)}
              placeholder="Message title..."
              className="bg-secondary border-border"
            />
            <textarea
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              placeholder="Message content..."
              className="w-full h-32 bg-secondary border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex gap-2">
              <Button onClick={createMessage} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button onClick={() => setShowCompose(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Search and Filters */}
      <Card className="glass p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <div className="flex gap-2 items-center">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as MessageCategory | "All")}
              className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
            >
              <option value="All">All Categories</option>
              <option value="Direct">Direct</option>
              <option value="Reminder">Reminder</option>
              <option value="Notification">Notification</option>
              <option value="System">System</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as MessageStatus | "All")}
              className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
            >
              <option value="All">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="starred">Starred</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Messages Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredMessages.length === 0 ? (
            <Card className="glass p-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No messages found</p>
            </Card>
          ) : (
            filteredMessages.map((msg) => {
              const Icon = getCategoryIcon(msg.category)
              const isSelected = selectedMessage?.id === msg.id

              return (
                <motion.div key={msg.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card
                    onClick={() => {
                      setSelectedMessage(msg)
                      if (msg.status === "unread") {
                        updateMessageStatus(msg.id, "read")
                      }
                    }}
                    className={`
                      glass p-4 cursor-pointer transition-all
                      ${isSelected ? "border-primary glow-emerald" : "hover:border-primary/30"}
                      ${msg.status === "unread" ? "bg-primary/5" : ""}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${getCategoryColor(msg.category)}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`font-medium truncate ${msg.status === "unread" ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {msg.title}
                          </p>
                          {msg.status === "unread" && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{msg.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">{new Date(msg.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="glass-strong p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-balance">{selectedMessage.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>From: {selectedMessage.sender || "Unknown"}</span>
                    <span>•</span>
                    <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-lg border text-sm font-medium ${getCategoryColor(selectedMessage.category)}`}
                >
                  {selectedMessage.category}
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-foreground leading-relaxed">{selectedMessage.content}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  onClick={() =>
                    updateMessageStatus(selectedMessage.id, selectedMessage.status === "starred" ? "read" : "starred")
                  }
                  variant="outline"
                  size="sm"
                  className={selectedMessage.status === "starred" ? "text-yellow-500 border-yellow-500/30" : ""}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {selectedMessage.status === "starred" ? "Unstar" : "Star"}
                </Button>
                <Button
                  onClick={() =>
                    updateMessageStatus(selectedMessage.id, selectedMessage.status === "archived" ? "read" : "archived")
                  }
                  variant="outline"
                  size="sm"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {selectedMessage.status === "archived" ? "Unarchive" : "Archive"}
                </Button>
                <Button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10 ml-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="glass p-12 text-center h-full flex items-center justify-center">
              <div>
                <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Select a message to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
