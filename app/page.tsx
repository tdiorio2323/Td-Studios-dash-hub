"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Calendar, FolderOpen, MessageSquare, Zap, BarChart3, Settings, Menu, X } from "lucide-react"
import HomeOverview from "@/components/home-overview"
import DailyPlanner from "@/components/daily-planner"
import FileVault from "@/components/file-vault"
import MessagesHub from "@/components/messages-hub"
import AutomationPanel from "@/components/automation-panel"
import SystemInsights from "@/components/system-insights"
import SettingsPanel from "@/components/settings-panel"
import { Button } from "@/components/ui/button"

type View = "home" | "planner" | "files" | "messages" | "automation" | "insights" | "settings"

export default function CommandHub() {
  const [activeView, setActiveView] = useState<View>("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { id: "home" as View, label: "Home", icon: Home },
    { id: "planner" as View, label: "Planner", icon: Calendar },
    { id: "files" as View, label: "Files", icon: FolderOpen },
    { id: "messages" as View, label: "Messages", icon: MessageSquare },
    { id: "automation" as View, label: "Automation", icon: Zap },
    { id: "insights" as View, label: "Insights", icon: BarChart3 },
    { id: "settings" as View, label: "Settings", icon: Settings },
  ]

  const handleNavigation = (view: View) => {
    setActiveView(view)
    setMobileMenuOpen(false)
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-strong border-b border-border px-4 py-3 flex items-center justify-between lg:hidden z-50"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl chrome-gradient flex items-center justify-center glow-chrome">
            <span className="text-background font-bold text-lg">TC</span>
          </div>
          <div>
            <h1 className="text-lg font-bold chrome-text">Tyler Command Hub</h1>
            <p className="text-xs text-muted-foreground">{navigation.find((n) => n.id === activeView)?.label}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-foreground hover:bg-secondary"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 glass-strong border-l border-border z-50 lg:hidden overflow-y-auto"
            >
              {/* Mobile menu header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold chrome-text">Navigation</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-foreground hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile navigation items */}
              <div className="p-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = activeView === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-4 rounded-xl
                        transition-all duration-200
                        ${
                          isActive
                            ? "chrome-gradient text-background glow-chrome-strong font-semibold"
                            : "text-foreground hover:bg-secondary/80"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Mobile user profile */}
              <div className="p-4 border-t border-border mt-auto">
                <div className="flex items-center gap-3 px-4 py-4 rounded-xl glass">
                  <div className="w-12 h-12 rounded-full chrome-gradient flex items-center justify-center glow-chrome">
                    <span className="text-sm font-bold text-background">TD</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Tyler Diorio</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden lg:flex w-72 glass-strong border-r border-border flex-col"
        >
          {/* Desktop logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl chrome-gradient flex items-center justify-center glow-chrome">
                <span className="text-background font-bold text-xl">TC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold chrome-text">Tyler Command Hub</h1>
                <p className="text-xs text-muted-foreground">Personal Productivity</p>
              </div>
            </div>
          </div>

          {/* Desktop navigation items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      isActive
                        ? "chrome-gradient text-background glow-chrome-strong font-semibold"
                        : "text-foreground hover:bg-secondary/80"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Desktop user profile */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass">
              <div className="w-12 h-12 rounded-full chrome-gradient flex items-center justify-center glow-chrome">
                <span className="text-sm font-bold text-background">TD</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Tyler Diorio</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeView === "home" && <HomeOverview />}
              {activeView === "planner" && <DailyPlanner />}
              {activeView === "files" && <FileVault />}
              {activeView === "messages" && <MessagesHub />}
              {activeView === "automation" && <AutomationPanel />}
              {activeView === "insights" && <SystemInsights />}
              {activeView === "settings" && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
