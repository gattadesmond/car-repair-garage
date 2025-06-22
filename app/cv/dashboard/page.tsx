"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, FileText, Clock, AlertCircle, CheckSquare, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getWorkOrders, getCustomers, getTechnicians, getCurrentUser } from "@/lib/demo-data"
import RoleLayout from "@/components/role-layout"

export default function CVDashboardPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [technicians, setTechnicians] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setLoading(true)
    const workOrdersData = getWorkOrders()
    const techniciansData = getTechnicians()

    setWorkOrders(workOrdersData)
    setTechnicians(techniciansData)
    setLoading(false)
  }

  // Tính toán các thống kê
  const pendingOrders = workOrders.filter((order) => order.status === "pending").length
  const inInspectionOrders = workOrders.filter((order) => ["diagnosis", "in_inspection"].includes(order.status)).length
  const completedOrders = workOrders.filter((order) => order.status === "completed").length

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
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Đang chờ</Badge>
      case "diagnosis":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Đang chuẩn đoán</Badge>
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

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <RoleLayout role="cv" title="Cố vấn dịch vụ">
      <div className="p-6 space-y-6">
        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Hành động nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/cv/customers">
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

          <Link href="/cv/intake-form">
            <Card className="hover:bg-green-50 transition-colors cursor-pointer border-2 border-green-200 shadow-md">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-3">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="font-medium text-green-700 text-lg">Tạo phiếu tiếp nhận</span>
                </div>
                <ArrowRight className="h-5 w-5 text-green-500" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Đơn hàng gần đây */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Đơn sửa chữa gần đây</h2>
            {/* <Link href="/repair-orders">
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Xem tất cả
              </Button>
            </Link> */}
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
                const currentUser = getCurrentUser()
                return (
                  <Card key={order.id} className="border-amber-200 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-base">{order.customer_name}</h3>
                            {order.status === "pending" ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Đang chờ
                              </Badge>
                            ) : order.status === "diagnosis" ? (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Đang chuẩn đoán
                              </Badge>
                            ) : order.status === "completed" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                                <CheckSquare className="h-3 w-3" /> Hoàn thành
                              </Badge>
                            ) : (
                              <Badge variant="outline">{order.status}</Badge>
                            )}
                          </div>
                             <div className="bg-gray-50 p-2 rounded-md mb-3">
                            <p className="text-lg font-medium flex items-center">
                              <FileText className="h-5 w-5 text-blue-500 mr-1" />
                              <span className="font-semibold">{order.car_info}</span> - <span className="text-gray-700">{order.license_plate}</span>
                            </p>
                            {order.customer_request && (
                              <p className="text-xs text-gray-600 mt-1">
                                <span className="font-medium">Yêu cầu:</span> {order.customer_request}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <p className="flex items-center text-gray-500">
                              <Clock className="h-4 w-4 text-blue-500 mr-1" />
                              <span className="mr-1">Ngày tiếp nhận:</span>
                              {new Date(order.creation_date).toLocaleDateString("vi-VN")}
                            </p>
                            <p className="flex items-center text-gray-500">
                              <Users className="h-4 w-4 text-blue-500 mr-1" />
                              <span className="mr-1">KTV:</span>
                              {technician ? technician.name : "Chưa phân công"}
                            </p>
                          </div>
                        </div>
                        <Link href={`/work-orders/${order.id}`}>
                          <Button 
                            variant={order.status === "pending" ? "default" : "outline"} 
                            size="sm"
                            className={order.status === "pending" ? "bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm" : "border-blue-300 text-blue-700 hover:bg-blue-50 shadow-sm"}
                          >
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
    </RoleLayout>
  )
}