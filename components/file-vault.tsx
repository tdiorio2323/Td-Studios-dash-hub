"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Upload,
  File,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  Trash2,
  Edit2,
  Download,
  Search,
  FolderOpen,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type FileCategory = "Work" | "Personal" | "Projects" | "Archive"

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  category: FileCategory
  uploadedAt: number
  data?: string // Base64 data for small files
}

export default function FileVault() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | "All">("All")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem("tyler-files")
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles))
    }
  }, [])

  // Save files to localStorage
  useEffect(() => {
    if (files.length > 0 || localStorage.getItem("tyler-files")) {
      localStorage.setItem("tyler-files", JSON.stringify(files))
    }
  }, [files])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles) return

    const newFiles: FileItem[] = []

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i]

      // For demo purposes, we'll store small files (< 1MB) as base64
      let data: string | undefined
      if (file.size < 1024 * 1024) {
        data = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })
      }

      newFiles.push({
        id: Date.now().toString() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        category: "Personal",
        uploadedAt: Date.now(),
        data,
      })
    }

    setFiles([...files, ...newFiles])
  }

  const deleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id))
  }

  const startRename = (file: FileItem) => {
    setEditingId(file.id)
    setEditingName(file.name)
  }

  const saveRename = (id: string) => {
    if (editingName.trim()) {
      setFiles(files.map((f) => (f.id === id ? { ...f, name: editingName } : f)))
    }
    setEditingId(null)
    setEditingName("")
  }

  const updateCategory = (id: string, category: FileCategory) => {
    setFiles(files.map((f) => (f.id === id ? { ...f, category } : f)))
  }

  const downloadFile = (file: FileItem) => {
    if (file.data) {
      const link = document.createElement("a")
      link.href = file.data
      link.download = file.name
      link.click()
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return Video
    if (type.startsWith("audio/")) return Music
    if (type.includes("pdf") || type.includes("document")) return FileText
    if (type.includes("zip") || type.includes("rar")) return Archive
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || file.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories: (FileCategory | "All")[] = ["All", "Work", "Personal", "Projects", "Archive"]

  const stats = {
    total: files.length,
    work: files.filter((f) => f.category === "Work").length,
    personal: files.filter((f) => f.category === "Personal").length,
    projects: files.filter((f) => f.category === "Projects").length,
    archive: files.filter((f) => f.category === "Archive").length,
    totalSize: files.reduce((acc, f) => acc + f.size, 0),
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-balance">File Vault</h2>
          <p className="text-muted-foreground mt-1">Organize and manage your files with categories</p>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
        <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="glass p-4">
          <p className="text-sm text-muted-foreground">Total Files</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </Card>
        <Card className="glass p-4">
          <p className="text-sm text-muted-foreground">Total Size</p>
          <p className="text-2xl font-bold text-primary mt-1">{formatFileSize(stats.totalSize)}</p>
        </Card>
        <Card className="glass p-4 border-blue-500/20">
          <p className="text-sm text-muted-foreground">Work</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{stats.work}</p>
        </Card>
        <Card className="glass p-4 border-primary/20">
          <p className="text-sm text-muted-foreground">Personal</p>
          <p className="text-2xl font-bold text-primary mt-1">{stats.personal}</p>
        </Card>
        <Card className="glass p-4 border-purple-500/20">
          <p className="text-sm text-muted-foreground">Projects</p>
          <p className="text-2xl font-bold text-purple-500 mt-1">{stats.projects}</p>
        </Card>
        <Card className="glass p-4 border-yellow-500/20">
          <p className="text-sm text-muted-foreground">Archive</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">{stats.archive}</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="glass p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-4 py-2 rounded-lg border font-medium text-sm whitespace-nowrap transition-all
                  ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <Card className="glass p-12 text-center">
          <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            {files.length === 0
              ? "No files uploaded yet. Click Upload Files to get started!"
              : "No files match your search."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredFiles.map((file) => {
            const Icon = getFileIcon(file.type)
            const isEditing = editingId === file.id

            return (
              <motion.div key={file.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="glass p-4 hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename(file.id)
                            if (e.key === "Escape") setEditingId(null)
                          }}
                          onBlur={() => saveRename(file.id)}
                          className="h-8 text-sm bg-secondary border-border"
                          autoFocus
                        />
                      ) : (
                        <p className="font-medium text-foreground truncate">{file.name}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{formatFileSize(file.size)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(file.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <select
                      value={file.category}
                      onChange={(e) => updateCategory(file.id, e.target.value as FileCategory)}
                      className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-secondary border border-border text-foreground"
                    >
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Projects">Projects</option>
                      <option value="Archive">Archive</option>
                    </select>

                    <button
                      onClick={() => startRename(file)}
                      className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {file.data && (
                      <button
                        onClick={() => downloadFile(file)}
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteFile(file.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
