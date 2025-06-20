"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, FileText, Settings, DollarSign, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import RoleLayout from "@/components/role-layout"
import { getWorkOrders, getCustomers, getTechnicians, getCurrentUser } from "@/lib/demo-data"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalWorkOrders: 0,
    totalRevenue: 0,
    completedOrdersPerMonth: 0,
    totalTechnicians: 0,
  })
  const [recentWorkOrders, setRecentWorkOrders] = useState<any[]>([])
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
    const totalRevenue = completedOrders.length * 2500000 // Estimated average
    const completedOrdersPerMonth = completedOrders.length // Simplified for demo
    const totalTechnicians = technicians.length

    setStats({
      totalCustomers,
      totalWorkOrders,
      totalRevenue,
      completedOrdersPerMonth,
      totalTechnicians,
    })

    // Get recent work orders
    const recent = [...workOrders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(order => {
        const customer = customers.find(c => c.id === order.customer_id)
        return {
          ...order,
          customer_name: customer ? customer.full_name : "Unknown",
        }
      })

    setRecentWorkOrders(recent)
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
      case "in_inspection":
        return <Badge className="bg-blue-500">Đang kiểm tra</Badge>
      case "in_progress":
        return <Badge className="bg-purple-500">Đang sửa chữa</Badge>
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <RoleLayout role="admin" title="Bảng điều khiển">
      <div className="space-y-6">
        {/* Overview Statistics */}
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
                <DollarSign className="h-4 w-4 text-green-600" />
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
              <Link href="/settings">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2">
                  <Settings className="h-6 w-6" />
                  <span>Cài đặt</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Work Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn sửa chữa gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : recentWorkOrders.length === 0 ? (
              <div className="text-center py-4">Không có đơn sửa chữa nào</div>
            ) : (
              <div className="space-y-4">
                {recentWorkOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{order.customer_name}</h4>
                      <p className="text-sm text-gray-500">{order.car_make} {order.car_model} - {order.license_plate}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(order.status)}
                      <Link href={`/work-orders/${order.id}`}>
                        <Button variant="outline" size="sm">Xem chi tiết</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}