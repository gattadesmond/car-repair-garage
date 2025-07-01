"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, FileText, Settings, CheckCircle, Clock, AlertCircle, CheckSquare, Calendar, User, Download, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import RoleLayout from "@/components/role-layout"
import { getWorkOrders, getCustomers, getTechnicians, getCurrentUser } from "@/lib/demo-data"
import OrderItem from "@/components/order-item"

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalWorkOrders: 0,
    completedOrdersPerMonth: 0,
    totalTechnicians: 0
  })
  const [recentWorkOrders, setRecentWorkOrders] = useState<WorkOrder[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    fetchData()
    setUser(getCurrentUser())
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
        const dateA = new Date(a.updated_at || a.created_at).getTime()
        const dateB = new Date(b.updated_at || b.created_at).getTime()
        return dateB - dateA
      })
      .slice(0, 5)

    setRecentWorkOrders(recent)
    setTechnicians(technicians)
    setLoading(false)
  }
  
  // Đã chuyển hàm getStatusBadge vào component OrderItem

  // Hàm lấy text cho nút hành động dựa trên trạng thái
  const getActionText = (status: string) => {
    switch (status) {
      case "pending":
        return "Phân công KTV"
      case "diagnosis":
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
    <RoleLayout role="admin">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Bảng điều khiển</h1>
        {/* <div className="flex flex-col xs:flex-row gap-2 xs:gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full xs:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button size="sm" className="w-full xs:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Tạo phiếu mới
          </Button>
        </div> */}
      </div>
      <div className="space-y-6">
        {/* Overview Statistics */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Khách hàng</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng đơn</p>
                  <p className="text-2xl font-bold">{stats.totalWorkOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Hoàn thành/tháng</p>
                  <p className="text-2xl font-bold">{stats.completedOrdersPerMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

     

        {/* Quick Actions */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Truy cập nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/admin/tasks" className="block">
                <Button variant="outline" className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  <span className="text-xs sm:text-sm text-center">Quản lý công việc</span>
                </Button>
              </Link>
              {/* <Link href="/admin/reports" className="block">
                <Button variant="outline" className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-200 transition-colors">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  <span className="text-xs sm:text-sm text-center">Báo cáo</span>
                </Button>
              </Link> */}
              <Link href="/admin/users" className="block">
                <Button variant="outline" className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200 transition-colors">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  <span className="text-xs sm:text-sm text-center">Quản lý người dùng</span>
                </Button>
              </Link>
              {/* <Link href="/admin/settings" className="block">
                <Button variant="outline" className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors">
                  <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  <span className="text-xs sm:text-sm text-center">Cài đặt</span>
                </Button>
              </Link> */}
            </div>
          </CardContent>
        </Card>

        {/* Đơn sửa chữa gần đây */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Đơn sửa chữa gần đây
            </h2>
            <Link href="/repair-orders" className="self-start md:self-auto">
              <Button variant="outline" size="sm" className="w-full xs:w-auto border-blue-200 text-blue-700 hover:bg-blue-50">
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
                  <OrderItem 
                    key={order.id} 
                    order={order} 
                    technician={technician} 
                    detailsUrl={`/work-orders/${order.id}`} 
                  />
                )
              })
            )}
          </div>
        </div>

        {/* Detailed Statistics */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">Thống kê chi tiết</CardTitle>
            <CardDescription className="text-sm text-gray-500">Tổng quan về hoạt động của garage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Kỹ thuật viên</p>
                      <p className="text-2xl font-bold text-blue-700">{stats.totalTechnicians}</p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}