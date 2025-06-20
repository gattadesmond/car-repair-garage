"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, FileText, Settings, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import RoleLayout from "@/components/role-layout"
import { getWorkOrders, getCustomers, getTechnicians, getCurrentUser } from "@/lib/demo-data"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalWorkOrders: 0,
    completedOrdersPerMonth: 0,
    totalTechnicians: 0,
  })
  const [recentWorkOrders, setRecentWorkOrders] = useState<any[]>([])
  const [technicians, setTechnicians] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.role !== "admin") {
      router.push(`/${currentUser.role}/dashboard`)
      return
    }

    setUser(currentUser)
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const workOrders = getWorkOrders()
    const customers = getCustomers()
    const technicians = getTechnicians()

    // Calculate statistics
    const totalCustomers = customers.length
    const totalWorkOrders = workOrders.length
    const completedOrders = workOrders.filter(order => order.status === "completed")
    const completedOrdersPerMonth = completedOrders.length // Simplified for demo
    const totalTechnicians = technicians.length

    setStats({
      totalCustomers,
      totalWorkOrders,
      completedOrdersPerMonth,
      totalTechnicians,
    })

    // Get recent work orders
    const recent = [...workOrders]
      .sort((a, b) => {
        const dateA = new Date(a.update_date || a.creation_date).getTime()
        const dateB = new Date(b.update_date || b.creation_date).getTime()
        return dateB - dateA
      })
      .slice(0, 5)

    setRecentWorkOrders(recent)
    setTechnicians(technicians)
    setLoading(false)
  }

  // Hàm lấy badge style dựa trên trạng thái
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Chờ xử lý</Badge>
      case "diagnosis":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Đang chẩn đoán</Badge>
      case "in_inspection":
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Đang chẩn đoán</Badge>
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Hoàn thành</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Hàm lấy text cho nút hành động dựa trên trạng thái
  const getActionText = (status: string) => {
    switch (status) {
      case "pending":
        return "Phân công KTV"
      case "diagnosis":
      case "in_inspection":
        return "Xem tiến độ"
      case "completed":
        return "Xem chi tiết"
      default:
        return "Xem chi tiết"
    }
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <RoleLayout role="admin" title="Bảng điều khiển">
      <div className="space-y-6">
        {/* Overview Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Khách hàng</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Tổng đơn</p>
                  <p className="text-2xl font-bold">{stats.totalWorkOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Hoàn thành/tháng</p>
                  <p className="text-2xl font-bold">{stats.completedOrdersPerMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê chi tiết</CardTitle>
            <CardDescription>Tổng quan về hoạt động của garage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Kỹ thuật viên</p>
                      <p className="text-2xl font-bold">{stats.totalTechnicians}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Truy cập nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/tasks">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span>Quản lý công việc</span>
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Báo cáo</span>
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Quản lý người dùng</span>
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2">
                  <Settings className="h-6 w-6" />
                  <span>Cài đặt</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Đơn sửa chữa gần đây */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Đơn sửa chữa gần đây</h2>
            <Link href="/repair-orders">
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Xem tất cả
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentWorkOrders.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center text-gray-500">
                  Không có đơn hàng nào
                </CardContent>
              </Card>
            ) : (
              recentWorkOrders.map((order) => {
                const technician = technicians.find((t) => t.id === order.technician_id)
                return (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{order.customer_name}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {order.license_plate} - {order.car_brand} {order.car_model} ({order.car_year})
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <p>
                              <span className="text-gray-500">KTV:</span>{" "}
                              {technician ? technician.name : "Chưa phân công"}
                            </p>
                            <p>
                              <span className="text-gray-500">Ngày tạo:</span>{" "}
                              {new Date(order.creation_date).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                        <Link href={`/work-orders/${order.id}`}>
                          <Button 
                            variant={order.status === "pending" ? "default" : "outline"} 
                            size="sm"
                            className={order.status === "pending" ? "bg-blue-600 hover:bg-blue-700 text-white font-medium" : "border-blue-300 text-blue-700 hover:bg-blue-50"}
                          >
                            {getActionText(order.status)}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </RoleLayout>
  )
}