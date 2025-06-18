"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, FileText, DollarSign, CheckCircle, Clock, AlertCircle, CheckSquare, BarChart3, UserCog, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getWorkOrders, getCustomers, getTechnicians, getCurrentUser } from "@/lib/demo-data"

export default function ManagerDashboardPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
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

    if (currentUser.role !== "manager") {
      router.push(`/${currentUser.role}/dashboard`)
      return
    }

    setUser(currentUser)
    fetchData()
  }, [])

  const fetchData = () => {
    setLoading(true)
    const workOrdersData = getWorkOrders()
    const customersData = getCustomers()
    const techniciansData = getTechnicians()

    setWorkOrders(workOrdersData)
    setCustomers(customersData)
    setTechnicians(techniciansData)
    setLoading(false)
  }

  // Tính toán các thống kê
  const totalCustomers = customers.length
  const totalWorkOrders = workOrders.length
  const totalRevenue = workOrders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + (order.total_amount || 0), 0)
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const completedThisMonth = workOrders.filter(
    (order) => {
      const orderDate = new Date(order.update_date || order.creation_date)
      return (
        order.status === "completed" &&
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      )
    }
  ).length

  const pendingOrders = workOrders.filter((order) => order.status === "pending").length
  const inInspectionOrders = workOrders.filter((order) => ["diagnosis", "in_inspection"].includes(order.status)).length
  const completedOrders = workOrders.filter((order) => order.status === "completed").length
  const totalTechnicians = technicians.length

  // Lấy 5 đơn hàng gần nhất
  const recentWorkOrders = [...workOrders]
    .sort((a, b) => {
      const dateA = new Date(a.update_date || a.creation_date).getTime()
      const dateB = new Date(b.update_date || b.creation_date).getTime()
      return dateB - dateA
    })
    .slice(0, 5)

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

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard Quản lý</h1>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">{user.email}</div>
            <Button variant="outline" size="sm" onClick={() => {
              localStorage.removeItem("user")
              router.push("/login")
            }}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tổng khách hàng</p>
                    <p className="text-2xl font-bold">{totalCustomers}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tổng đơn sửa chữa</p>
                    <p className="text-2xl font-bold">{totalWorkOrders}</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-indigo-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
                    <p className="text-2xl font-bold">{totalRevenue.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hoàn thành tháng này</p>
                    <p className="text-2xl font-bold">{completedThisMonth}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Chờ xử lý</p>
                  <div className="bg-yellow-50 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{pendingOrders}</p>
                <p className="text-sm text-gray-500">đơn hàng</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Đang chẩn đoán</p>
                  <div className="bg-blue-50 p-2 rounded-full">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{inInspectionOrders}</p>
                <p className="text-sm text-gray-500">đơn hàng</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Hoàn thành</p>
                  <div className="bg-green-50 p-2 rounded-full">
                    <CheckSquare className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{completedOrders}</p>
                <p className="text-sm text-gray-500">đơn hàng</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Tổng kỹ thuật viên</p>
                  <div className="bg-purple-50 p-2 rounded-full">
                    <UserCog className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{totalTechnicians}</p>
                <p className="text-sm text-gray-500">nhân viên</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/manager/tasks">
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-indigo-50 p-2 rounded-full mr-3">
                      <FileText className="h-5 w-5 text-indigo-500" />
                    </div>
                    <span className="font-medium">Quản lý công việc</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/manager/reports">
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-50 p-2 rounded-full mr-3">
                      <BarChart3 className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="font-medium">Báo cáo</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/manager/users">
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-full mr-3">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="font-medium">Quản lý nhân viên</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/manager/settings">
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <Settings className="h-5 w-5 text-gray-500" />
                    </div>
                    <span className="font-medium">Cài đặt</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Work Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Đơn sửa chữa gần đây</h2>
              <Link href="/manager/work-orders">
                <Button variant="outline" size="sm">
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
                  const customer = customers.find((c) => c.id === order.customer_id)
                  const car = customer?.cars.find((c) => c.id === order.car_id)
                  return (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium">{customer?.name || "Khách hàng"}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {car?.license_plate} - {car?.brand} {car?.model} ({car?.year})
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Yêu cầu:</span> {order.customer_request.substring(0, 100)}
                              {order.customer_request.length > 100 ? "..." : ""}
                            </p>
                          </div>
                          <Link href={`/manager/work-orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              Chi tiết
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
      </main>
    </div>
  )
}