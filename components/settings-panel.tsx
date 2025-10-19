"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SettingsIcon, Moon, Sun, Type, Download, Upload, Trash2, User, Shield, Bell, Database } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UserProfile {
  name: string
  email: string
  role: string
}

interface AppSettings {
  theme: "light" | "dark"
  fontSize: "small" | "medium" | "large"
  notifications: boolean
}

export default function SettingsPanel() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Tyler Diorio",
    email: "tyler@example.com",
    role: "Admin",
  })

  const [settings, setSettings] = useState<AppSettings>({
    theme: "dark",
    fontSize: "medium",
    notifications: true,
  })

  const [isEditing, setIsEditing] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("tyler-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    const savedProfile = localStorage.getItem("tyler-profile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("tyler-settings", JSON.stringify(settings))
  }, [settings])

  const saveProfile = () => {
    localStorage.setItem("tyler-profile", JSON.stringify(profile))
    setIsEditing(false)
  }

  const exportData = () => {
    const data = {
      tasks: JSON.parse(localStorage.getItem("tyler-tasks") || "[]"),
      files: JSON.parse(localStorage.getItem("tyler-files") || "[]"),
      messages: JSON.parse(localStorage.getItem("tyler-messages") || "[]"),
      settings,
      profile,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `tyler-command-hub-backup-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)

        if (data.tasks) localStorage.setItem("tyler-tasks", JSON.stringify(data.tasks))
        if (data.files) localStorage.setItem("tyler-files", JSON.stringify(data.files))
        if (data.messages) localStorage.setItem("tyler-messages", JSON.stringify(data.messages))
        if (data.settings) setSettings(data.settings)
        if (data.profile) setProfile(data.profile)

        alert("Data imported successfully! Refresh the page to see changes.")
      } catch (error) {
        alert("Failed to import data. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("tyler-tasks")
      localStorage.removeItem("tyler-files")
      localStorage.removeItem("tyler-messages")
      localStorage.removeItem("tyler-settings")
      localStorage.removeItem("tyler-profile")
      alert("All data cleared! Refresh the page.")
    }
  }

  const getStorageSize = () => {
    let total = 0
    for (const key in localStorage) {
      if (key.startsWith("tyler-")) {
        total += localStorage[key].length
      }
    }
    return (total / 1024).toFixed(2) + " KB"
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-balance">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your preferences and data</p>
      </div>

      {/* Profile Section */}
      <Card className="glass-strong p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Profile</h3>
        </div>

        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full chrome-gradient flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-background">TD</span>
          </div>

          <div className="flex-1 space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveProfile} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Save Changes
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-medium text-foreground">{profile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-lg font-medium text-foreground">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="text-lg font-medium text-foreground">{profile.role}</p>
                </div>
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.theme === "dark" ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-foreground">Theme</p>
                <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSettings({ ...settings, theme: "light" })}
                className={`
                  px-4 py-2 rounded-lg border transition-all
                  ${settings.theme === "light" ? "bg-primary text-primary-foreground border-primary" : "border-border bg-secondary text-muted-foreground"}
                `}
              >
                Light
              </button>
              <button
                onClick={() => setSettings({ ...settings, theme: "dark" })}
                className={`
                  px-4 py-2 rounded-lg border transition-all
                  ${settings.theme === "dark" ? "bg-primary text-primary-foreground border-primary" : "border-border bg-secondary text-muted-foreground"}
                `}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Font Size</p>
                <p className="text-sm text-muted-foreground">Adjust text size for readability</p>
              </div>
            </div>
            <div className="flex gap-2">
              {(["small", "medium", "large"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setSettings({ ...settings, fontSize: size })}
                  className={`
                    px-4 py-2 rounded-lg border transition-all capitalize
                    ${settings.fontSize === size ? "bg-primary text-primary-foreground border-primary" : "border-border bg-secondary text-muted-foreground"}
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Notifications</p>
                <p className="text-sm text-muted-foreground">Enable or disable notifications</p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
              className={`
                relative w-14 h-8 rounded-full transition-colors
                ${settings.notifications ? "bg-primary" : "bg-secondary"}
              `}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white"
                animate={{ left: settings.notifications ? "30px" : "4px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Data Management</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-secondary border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Storage Used</p>
                <p className="text-sm text-muted-foreground mt-1">{getStorageSize()} of localStorage</p>
              </div>
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Button onClick={exportData} variant="outline" className="w-full bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>

            <label className="w-full">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </span>
              </Button>
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>

            <Button
              onClick={clearAllData}
              variant="outline"
              className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="glass p-6">
        <h3 className="text-lg font-semibold mb-4">About Tyler Command Hub</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Version 1.0.0</p>
          <p>A personal productivity dashboard built with React, Next.js, and Tailwind CSS</p>
          <p className="pt-4 border-t border-border">
            Data is stored locally in your browser using localStorage. For production use, consider integrating with
            Supabase or Firebase for cloud storage.
          </p>
        </div>
      </Card>
    </div>
  )
}
