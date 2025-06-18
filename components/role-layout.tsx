"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getCurrentUser } from "@/lib/demo-data"
import {
  Users,
  FileText,
  BarChart3,
  Settings,
  Menu,
  Home,
  LogOut,
  Car,
  ClipboardList,
  UserCog,
  LayoutDashboard,
} from "lucide-react"
import { Wrench } from "lucide-react"

type RoleLayoutProps = {
  children: React.ReactNode
  role: "cv" | "admin" | "ktv"
  title?: string
}

export default function RoleLayout({ children, role, title }: RoleLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.role !== role) {
      router.push(`/${currentUser.role}/dashboard`)
      return
    }

    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Định nghĩa các liên kết dựa trên vai trò
  const getNavLinks = () => {
    switch (role) {
      case "cv":
        return [
          { href: "/cv/dashboard", label: "Tổng quan", icon: <Home className="h-5 w-5" /> },
          { href: "/cv/customers", label: "Khách hàng", icon: <Users className="h-5 w-5" /> },
          { href: "/cv/intake-form", label: "Tạo phiếu tiếp nhận", icon: <ClipboardList className="h-5 w-5" /> },
          { href: "/repair-orders", label: "Đơn sửa chữa", icon: <FileText className="h-5 w-5" /> },
        ]
      case "admin":
        return [
          { href: "/dashboard/admin", label: "Tổng quan", icon: <LayoutDashboard className="h-5 w-5" /> },
          { href: "/customers", label: "Khách hàng", icon: <Users className="h-5 w-5" /> },
          { href: "/repair-orders", label: "Đơn sửa chữa", icon: <FileText className="h-5 w-5" /> },
          { href: "/technicians", label: "Kỹ thuật viên", icon: <Wrench className="h-5 w-5" /> },
          { href: "/reports", label: "Báo cáo", icon: <BarChart3 className="h-5 w-5" /> },
          { href: "/settings", label: "Cài đặt", icon: <Settings className="h-5 w-5" /> },
        ]
      case "ktv":
        return [
          { href: "/ktv/dashboard", label: "Tổng quan", icon: <LayoutDashboard className="h-5 w-5" /> },
          { href: "/ktv/repair-orders", label: "Đơn sửa chữa", icon: <FileText className="h-5 w-5" /> },
          { href: "/ktv/tasks", label: "Công việc", icon: <ClipboardList className="h-5 w-5" /> },
        ]
      default:
        return []
    }
  }

  const navLinks = getNavLinks()

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4 border-b">
                  <h2 className="font-semibold text-lg">{title || `${role.toUpperCase()} Dashboard`}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <nav className="p-2">
                  <ul className="space-y-1">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>
                          <Button
                            variant={pathname === link.href ? "secondary" : "ghost"}
                            className="w-full justify-start"
                          >
                            {link.icon}
                            <span className="ml-2">{link.label}</span>
                          </Button>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="ml-2">Đăng xuất</span>
                      </Button>
                    </li>
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold ml-2">{title || `${role.toUpperCase()} Dashboard`}</h1>
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </header>

      {/* Desktop Layout */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r h-screen sticky top-0">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">{title || `${role.toUpperCase()} Dashboard`}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <nav className="p-2">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <Button
                      variant={pathname === link.href ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      {link.icon}
                      <span className="ml-2">{link.label}</span>
                    </Button>
                  </Link>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2">Đăng xuất</span>
                </Button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}