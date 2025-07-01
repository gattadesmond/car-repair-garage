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
  Shield,
} from "lucide-react"
import { Wrench } from "lucide-react"

type RoleLayoutProps = {
  children: React.ReactNode
  role: "cv" | "admin" | "ktv" | Array<"cv" | "admin" | "ktv">
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

    // Kiểm tra nếu role là mảng hoặc giá trị đơn
    const allowedRoles = Array.isArray(role) ? role : [role]
    if (!allowedRoles.includes(currentUser.role)) {
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
    switch (user?.role) {
      case "cv":
        return [
          { href: "/cv/dashboard", label: "Tổng quan", icon: <Home className="h-5 w-5" /> },
          { href: "/cv/customers", label: "Khách hàng", icon: <Users className="h-5 w-5" /> },
          { href: "/cv/intake-form", label: "Tạo phiếu tiếp nhận", icon: <ClipboardList className="h-5 w-5" /> },
        ]
      case "admin":
        return [
          { href: "/admin/dashboard", label: "Tổng quan", icon: <LayoutDashboard className="h-5 w-5" /> },
          { href: "/admin/tasks", label: "Công việc", icon: <ClipboardList className="h-5 w-5" /> },
          // { href: "/admin/customers", label: "Khách hàng", icon: <Users className="h-5 w-5" /> },
          { href: "/admin/users", label: "Nhân viên", icon: <UserCog className="h-5 w-5" /> },
          // { href: "/admin/reports", label: "Báo cáo", icon: <BarChart3 className="h-5 w-5" /> },
          // { href: "/admin/settings", label: "Cài đặt", icon: <Settings className="h-5 w-5" /> },
        ]
      case "ktv":
        return [
          { href: "/ktv/dashboard", label: "Tổng quan", icon: <LayoutDashboard className="h-5 w-5" /> },
          { href: "/ktv/tasks", label: "Công việc", icon: <ClipboardList className="h-5 w-5" /> },
        ]
      default:
        return []
    }
  }

  const navLinks = getNavLinks()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-700 font-medium">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-blue-100 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 -ml-2 mr-1">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-[300px] p-0 border-r border-blue-100 bg-white z-50">
                <div className="p-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                      {Array.isArray(role) ? (
                        role.includes("admin") ? <Shield className="h-5 w-5" /> :
                        role.includes("cv") ? <Users className="h-5 w-5" /> :
                        <Wrench className="h-5 w-5" />
                      ) : (
                        role === "cv" ? <Users className="h-5 w-5" /> :
                        role === "ktv" ? <Wrench className="h-5 w-5" /> :
                        <Shield className="h-5 w-5" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h2 className="font-semibold text-lg text-blue-800 truncate">
                        {title || `${Array.isArray(role) ? role[0].toUpperCase() : role.toUpperCase()} Dashboard`}
                      </h2>
                      <p className="text-sm text-blue-600 truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>
                </div>
                <nav className="p-3 overflow-y-auto max-h-[calc(100vh-100px)]">
                  <ul className="space-y-2">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>
                          <Button
                            variant={pathname === link.href ? "secondary" : "ghost"}
                            className={`w-full justify-start transition-all duration-200 py-3 ${pathname === link.href 
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 font-medium" 
                              : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}
                          >
                            {link.icon}
                            <span className="ml-3 font-medium">{link.label}</span>
                          </Button>
                        </Link>
                      </li>
                    ))}
                    <li className="pt-3 mt-3 border-t border-blue-100">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 py-3"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="ml-3 font-medium">Đăng xuất</span>
                      </Button>
                    </li>
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold ml-1 text-blue-800 truncate max-w-[200px]">
              {title || `${Array.isArray(role) ? role[0].toUpperCase() : role.toUpperCase()} Dashboard`}
            </h1>
          </div>
          <div className="text-sm text-blue-600 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline truncate max-w-[120px]">{user.email}</span>
          </div>
        </div>
      </header>

      {/* Desktop Layout */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 bg-white border-r border-blue-100 h-screen sticky top-0 shadow-lg shadow-blue-100/50">
          <div className="p-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                {role === "cv" && <Users className="h-6 w-6" />}
                {role === "ktv" && <Wrench className="h-6 w-6" />}
                {role === "admin" && <Shield className="h-6 w-6" />}
              </div>
              <div>
                <h2 className="font-semibold text-xl text-blue-800">{title || `Dashboard`}</h2>
                <p className="text-sm text-blue-600 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          <nav className="p-3">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <Button
                      variant={pathname === link.href ? "secondary" : "ghost"}
                      className={`w-full justify-start transition-all duration-200 ${pathname === link.href 
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 font-medium" 
                        : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}
                    >
                      {link.icon}
                      <span className="ml-2">{link.label}</span>
                    </Button>
                  </Link>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t border-blue-100">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
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
        <main className="flex-1 p-4 sm:p-5 lg:p-6 pb-20">{children}</main>
      </div>
    </div>
  )
}