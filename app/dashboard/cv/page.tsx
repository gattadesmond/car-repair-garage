"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Car, Users, FileText, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { getWorkOrders, type WorkOrder } from "@/lib/demo-data"
import { getTechnicians, type Technician } from "@/lib/demo-data"

export default function CVDashboard() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inInspection: 0,
    completed: 0,
  })
  const [technicians, setTechnicians] = useState<Technician[]>([])

  useEffect(() => {
    fetchWorkOrders()
    fetchTechnicians()
  }, [])

  const fetchTechnicians = () => {
    const techs = getTechnicians()
    setTechnicians(techs)
  }

  const fetchWorkOrders = () => {
    const orders = getWorkOrders()
    setWorkOrders(orders.slice(0, 10)) // Show latest 10

    setStats({
      total: orders.length,
      pending: orders.filter((w) => w.status === "pending").length,
      inInspection: orders.filter((w) => w.status === "in_inspection").length,
      completed: orders.filter((w) => w.status === "completed").length,
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Chờ xử lý", variant: "secondary" as const },
      in_inspection: { label: "Đang kiểm tra", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
      quotation: { label: "Báo giá", variant: "outline" as const },
      diagnosis: { label: "Chẩn đoán", variant: "outline" as const },
      approved: { label: "Đã duyệt", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  const getDetailLink = (order: WorkOrder) => {
    // Điều hướng dựa trên trạng thái của phiếu
    switch (order.status) {
      case "pending":
        return `/diagnosis/${order.id}`
      case "diagnosis":
        return `/diagnosis/${order.id}`
      case "quotation":
        return `/quotations/${order.id}/edit`
      case "approved":
        return `/quotations/${order.id}`
      default:
        return `/work-orders/${order.id}`
    }
  }

  const getActionText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chẩn đoán"
      case "diagnosis":
        return "Xem chẩn đoán"
      case "quotation":
        return "Lập báo giá"
      case "approved":
        return "Xem báo giá"
      default:
        return "Xem chi tiết"
    }
  }

  return (
    <DashboardLayout role="cv" title="Dashboard Cố vấn dịch vụ">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Tổng phiếu</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Chờ xử lý</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Car className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Đang kiểm tra</p>
                  <p className="text-2xl font-bold">{stats.inInspection}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Hoàn thành</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/customers">
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-blue-200">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-blue-600 rounded-full text-white group-hover:bg-blue-700 transition-colors">
                      <Users className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">Quản lý khách hàng</h3>
                      <p className="text-sm text-blue-700 mt-1">Xem danh sách và thông tin khách hàng</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Users className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
              </Link>

              <Link href="/intake-form">
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-green-200">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-green-600 rounded-full text-white group-hover:bg-green-700 transition-colors">
                      <Plus className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">Tạo phiếu tiếp nhận</h3>
                      <p className="text-sm text-green-700 mt-1">Tạo phiếu mới cho khách hàng</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Plus className="h-12 w-12 text-green-600" />
                  </div>
                </div>
              </Link>

              <Link href="/quotations">
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-purple-200">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-purple-600 rounded-full text-white group-hover:bg-purple-700 transition-colors">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900">Lập báo giá</h3>
                      <p className="text-sm text-purple-700 mt-1">Tạo và quản lý báo giá sửa chữa</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                    <FileText className="h-12 w-12 text-purple-600" />
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Work Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Phiếu tiếp nhận gần đây</CardTitle>
            <CardDescription>10 phiếu mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
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
                    {order.assigned_technician && (
                      <p className="text-xs text-gray-500">
                        KTV:{" "}
                        {technicians.find((t) => t.id === order.assigned_technician)?.full_name ||
                          order.assigned_technician}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString("vi-VN")}</p>
                  </div>
                  <Link href={getDetailLink(order)}>
                    <Button variant="outline" size="sm">
                      {getActionText(order.status)}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
