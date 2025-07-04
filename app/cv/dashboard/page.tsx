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
import OrderItem from "@/components/order-item"

export default function CVDashboardPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [technicians, setTechnicians] = useState<any[]>([])
  const [recentWorkOrders, setRecentWorkOrders] = useState<any[]>([])
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
    
    // Lấy 5 đơn hàng gần nhất
    const recent = [...workOrdersData]
      .sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at).getTime()
        const dateB = new Date(b.updated_at || b.created_at).getTime()
        return dateB - dateA
      })
      .slice(0, 5)
    
    setRecentWorkOrders(recent)
    setLoading(false)
  }

  // Tính toán các thống kê
  const pendingOrders = workOrders.filter((order) => order.status === "pending").length
  const inInspectionOrders = workOrders.filter((order) => ["diagnosis", "in_inspection"].includes(order.status)).length
  const completedOrders = workOrders.filter((order) => order.status === "completed").length

  // Tính toán các thống kê từ workOrders

  // Không cần hàm getStatusBadge và getActionText nữa vì đã được xử lý trong component OrderItem

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <RoleLayout role="cv" title="Cố vấn dịch vụ">
      <div className="md:p-6 space-y-6">
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
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Đơn sửa chữa gần đây
            </h2>
            {/* <Link href="/repair-orders" className="self-start md:self-auto">
              <Button variant="outline" size="sm" className="w-full xs:w-auto border-blue-200 text-blue-700 hover:bg-blue-50">
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
      </div>
    </RoleLayout>
  )
}