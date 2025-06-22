"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, DollarSign, TrendingUp, FileText, Settings, ClipboardList } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { getWorkOrders, getCustomers, getTechnicians, type WorkOrder } from "@/lib/demo-data"

export default function AdminDashboard() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalWorkOrders: 0,
    totalRevenue: 0,
    completedThisMonth: 0,
    pendingOrders: 0,
    inInspectionOrders: 0,
    completedOrders: 0,
    totalTechnicians: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    const orders = getWorkOrders()
    const customers = getCustomers()
    const technicians = getTechnicians()

    setWorkOrders(orders.slice(0, 10)) // Show latest 10

    // Calculate stats
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const completedThisMonth = orders.filter((order) => {
      const orderDate = new Date(order.created_at)
      return (
        order.status === "completed" && orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
      )
    }).length

    // Estimate revenue (simplified calculation)
    const estimatedRevenue = orders.filter((o) => o.status === "completed").length * 2500000 // Average 2.5M per order

    setStats({
      totalCustomers: customers.length,
      totalWorkOrders: orders.length,
      totalRevenue: estimatedRevenue,
      completedThisMonth,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      inInspectionOrders: orders.filter((o) => o.status === "diagnosis").length,
      completedOrders: orders.filter((o) => o.status === "completed").length,
      totalTechnicians: technicians.length,
    })

    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Đang chờ", variant: "secondary" as const },
      diagnosis: { label: "Đang chuẩn đoán", variant: "outline" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  return (
    <DashboardLayout role="admin" title="Dashboard Quản lý">
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <FileText className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Tổng phiếu</p>
                  <p className="text-2xl font-bold">{stats.totalWorkOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Doanh thu</p>
                  <p className="text-2xl font-bold">{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Hoàn thành/tháng</p>
                  <p className="text-2xl font-bold">{stats.completedThisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê phiếu sửa chữa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Chờ xử lý</span>
                  <Badge variant="secondary">{stats.pendingOrders}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Đang kiểm tra</span>
                  <Badge variant="default">{stats.inInspectionOrders}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Hoàn thành</span>
                  <Badge variant="default">{stats.completedOrders}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tổng kỹ thuật viên</span>
                  <Badge variant="outline">{stats.totalTechnicians}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/tasks">
                  <Button variant="outline" className="w-full justify-start">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Phân công KTV
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Xem báo cáo chi tiết
                  </Button>
                </Link>
                <Link href="/users">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Quản lý người dùng
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Cài đặt hệ thống
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Work Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Phiếu sửa chữa gần đây</CardTitle>
            <CardDescription>10 phiếu mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : workOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Chưa có phiếu sửa chữa nào</div>
            ) : (
              <div className="space-y-4">
                {workOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{order.customer_name}</h4>
                        <Badge {...getStatusBadge(order.status)}>{getStatusBadge(order.status).label}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.license_plate} - {order.car_info}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <Link href={`/work-orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
