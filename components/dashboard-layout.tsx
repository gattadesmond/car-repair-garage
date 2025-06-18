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
    const baseItems = [{ href: `/dashboard/${role}`, icon: Home, label: "Dashboard" }]

    if (role === "cv") {
      return [
        ...baseItems,
        { href: "/customers", icon: Users, label: "Khách hàng" },
        { href: "/intake-form", icon: FileText, label: "Phiếu tiếp nhận" },
        { href: "/quotations", icon: DollarSign, label: "Báo giá" },
      ]
    }

    if (role === "ktv") {
      return [
        ...baseItems,
        { href: "/tasks", icon: ClipboardList, label: "Công việc" },
        { href: "/repair-orders", icon: Wrench, label: "Lệnh sửa chữa" },
      ]
    }

    if (role === "admin") {
      return [
        ...baseItems,
        { href: "/intake-form", icon: FileText, label: "Phiếu tiếp nhận" },
        { href: "/tasks", icon: ClipboardList, label: "Phân công KTV" },
        { href: "/reports", icon: BarChart3, label: "Báo cáo" },
        { href: "/users", icon: Users, label: "Người dùng" },
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
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Gara Manager</h2>
            <p className="text-xs text-gray-500 capitalize">
              {role === "cv" ? "Cố vấn dịch vụ" : role === "ktv" ? "Kỹ thuật viên" : "Quản lý"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        {user && (
          <div className="mb-4">
            <p className="text-sm font-medium">{user.email}</p>
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
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="font-semibold text-lg">{title}</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r min-h-screen">
          <NavContent />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="hidden lg:block bg-white border-b px-6 py-4">
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
