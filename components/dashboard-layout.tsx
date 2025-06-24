"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Wrench,
  ClipboardList,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/demo-data"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "cv" | "ktv" | "admin"
  title: string
}

export default function DashboardLayout({ children, role, title }: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const getNavItems = () => {
    let dashboardLink = ""
    
    if (role === "cv") {
      dashboardLink = "/cv/dashboard"
    } else {
      dashboardLink = `/dashboard/${role}`
    }
    
    const baseItems = [{ href: dashboardLink, icon: Home, label: "Dashboard" }]

    if (role === "cv") {
      return [
        ...baseItems,
        { href: "/customers", icon: Users, label: "Khách hàng" },
        { href: "/intake-form", icon: FileText, label: "Phiếu tiếp nhận" },
      ]
    }

    if (role === "ktv") {
      return [
        ...baseItems,
      ]
    }

    if (role === "admin") {
      return [
        ...baseItems,
        { href: "/tasks", icon: ClipboardList, label: "Phân công KTV" },
        { href: "/reports", icon: BarChart3, label: "Báo cáo" },
        { href: "/users", icon: Users, label: "Nhân viên" },
        { href: "/settings", icon: Settings, label: "Cài đặt" },
      ]
    }

    return baseItems
  }

  const navItems = getNavItems()

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Gara Manager</h2>
            <p className="text-sm text-gray-500 capitalize">
              {role === "cv" ? "Cố vấn dịch vụ" : role === "ktv" ? "Kỹ thuật viên" : "Quản lý"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        {user && (
          <div className="mb-4 flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">{user.name?.charAt(0) || user.email?.charAt(0)}</span>
            </div>
            <div className="overflow-hidden">
              {user.name && <p className="font-medium truncate">{user.name}</p>}
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-2 -ml-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px]">
              <NavContent />
            </SheetContent>
          </Sheet>
          <h1 className="font-semibold text-lg truncate">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {user && (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{user.name?.charAt(0) || user.email?.charAt(0)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r min-h-screen">
          <NavContent />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="hidden lg:block bg-white border-b px-6 py-4 sticky top-0 z-10 shadow-sm">
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
          <main className="p-4 lg:p-6 pb-20">{children}</main>
        </div>
      </div>
    </div>
  )
}
