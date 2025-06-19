"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, DollarSign, TrendingUp, FileText, Settings, ClipboardList, UserCircle } from "lucide-react"
import Link from "next/link"
import RoleLayout from "@/components/role-layout"
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
      inInspectionOrders: orders.filter((o) => o.status === "in_inspection").length,
      completedOrders: orders.filter((o) => o.status === "completed").length,
      totalTechnicians: technicians.length,
    })

    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Chờ xử lý", variant: "secondary" as const },
      diagnosis: { label: "Chẩn đoán", variant: "outline" as const },
      in_inspection: { label: "Đang kiểm tra", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
      delivered: { label: "Đã giao", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <RoleLayout role="admin" title="Dashboard Quản lý">
      <div className="space-y-6">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/customers">
            <Card className="hover:bg-blue-50 transition-colors cursor-pointer border-2 border-blue-200 shadow-md">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="font-medium text-blue-700 text-lg">Quản lý khách hàng</span>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-500" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/technicians">
            <Card className="hover:bg-green-50 transition-colors cursor-pointer border-2 border-green-200 shadow-md">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-3">
                    <Wrench className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="font-medium text-green-700 text-lg">Phân công KTV</span>
                </div>
                <ArrowRight className="h-5 w-5 text-green-500" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/reports">
            <Card className="hover:bg-purple-50 transition-colors cursor-pointer border-2 border-purple-200 shadow-md">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-3">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="font-medium text-purple-700 text-lg">Báo cáo</span>
                </div>
                <ArrowRight className="h-5 w-5 text-purple-500" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="hover:bg-gray-100 transition-colors cursor-pointer border-2 border-gray-200 shadow-md">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-3 rounded-full mr-3">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-700 text-lg">Cài đặt</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-500" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-full">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Đơn sửa chữa</p>
                  <p className="text-2xl font-bold">{stats.totalWorkOrders}</p>
                </div>
                <div className="bg-amber-50 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Doanh thu</p>
                  <p className="text-2xl font-bold">{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-green-50 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Hoàn thành tháng này</p>
                  <p className="text-2xl font-bold">{stats.completedThisMonth}</p>
                </div>
                <div className="bg-purple-50 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Work Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn sửa chữa gần đây</CardTitle>
            <CardDescription>Danh sách 10 đơn sửa chữa gần nhất</CardDescription>
            <Link href="/admin/work-orders">
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Xem tất cả
              </Button>
            </Link>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Mã đơn</th>
                    <th className="text-left py-3 px-4 font-medium">Khách hàng</th>
                    <th className="text-left py-3 px-4 font-medium">Xe</th>
                    <th className="text-left py-3 px-4 font-medium">Trạng thái</th>
                    <th className="text-left py-3 px-4 font-medium">Ngày tạo</th>
                    <th className="text-right py-3 px-4 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrders.map((order) => {
                    const status = getStatusBadge(order.status)
                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">#{order.id.slice(0, 8)}</td>
                        <td className="py-3 px-4">{order.customer_name}</td>
                        <td className="py-3 px-4">
                          {order.car_brand} {order.car_model} - {order.license_plate}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString("vi-VN")}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            Chi tiết
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}