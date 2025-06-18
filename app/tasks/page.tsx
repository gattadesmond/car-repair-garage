"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Car, User, FileText, Calendar, ClipboardList, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { getWorkOrders, getTechnicians, saveWorkOrders, getCurrentUser, type WorkOrder, type Technician } from "@/lib/demo-data"

export default function TasksPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = () => {
    const user = getCurrentUser()
    setCurrentUser(user)

    const orders = getWorkOrders()
    const techs = getTechnicians()

    // Lọc theo vai trò người dùng và trạng thái
    let filteredOrders = orders
    
    // Nếu người dùng là KTV, chỉ hiển thị các công việc được gán cho KTV đó
    if (user?.role === "ktv") {
      filteredOrders = orders.filter((o) => o.assigned_technician === user.id)
    }
    
    // Tiếp tục lọc theo trạng thái nếu cần
    if (filter === "pending") {
      filteredOrders = filteredOrders.filter((o) => o.status === "pending" || o.status === "diagnosis")
    } else if (filter === "in_inspection") {
      filteredOrders = filteredOrders.filter((o) => o.status === "in_inspection")
    } else if (filter === "completed") {
      filteredOrders = filteredOrders.filter((o) => o.status === "completed")
    }

    // Sắp xếp theo thời gian tạo, mới nhất lên đầu
    filteredOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setWorkOrders(filteredOrders)
    setTechnicians(techs)
    setLoading(false)
  }

  const assignTechnician = (orderId: string, technicianId: string) => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const orders = getWorkOrders()
      const orderIndex = orders.findIndex((o) => o.id === orderId)

      if (orderIndex !== -1) {
        orders[orderIndex] = {
          ...orders[orderIndex],
          assigned_technician: technicianId === "unassigned" ? null : technicianId,
          status: orders[orderIndex].status === "pending" ? "diagnosis" : orders[orderIndex].status,
          updated_at: new Date().toISOString(),
        }

        saveWorkOrders(orders)
        setSuccess(`Đã phân công KTV thành công!`)
        fetchData() // Refresh data
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi phân công KTV")
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Chờ xử lý", variant: "secondary" as const },
      diagnosis: { label: "Chẩn đoán", variant: "outline" as const },
      quotation: { label: "Báo giá", variant: "outline" as const },
      approved: { label: "Đã duyệt", variant: "default" as const },
      in_inspection: { label: "Đang kiểm tra", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
      delivered: { label: "Đã giao", variant: "default" as const },
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
        return "Tiếp tục chẩn đoán"
      case "quotation":
        return "Lập báo giá"
      case "approved":
        return "Xem báo giá"
      default:
        return "Xem chi tiết"
    }
  }

  return (
    <DashboardLayout role={currentUser?.role || "admin"} title="Quản lý công việc & Phân công KTV">
      <div className="space-y-6">
        {/* Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5" />
              <span>Danh sách công việc</span>
            </CardTitle>
            <CardDescription>Quản lý và phân công công việc cho kỹ thuật viên</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="status-filter">Lọc theo trạng thái</Label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pending">Chờ xử lý & Chẩn đoán</SelectItem>
                    <SelectItem value="in_inspection">Đang kiểm tra</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="search">Tìm kiếm</Label>
                <Input id="search" placeholder="Tìm theo tên KH, biển số..." />
              </div>
            </div>

            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : workOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Không có phiếu sửa chữa nào</div>
            ) : (
              <div className="space-y-4">
                {workOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{order.customer_name}</h4>
                          <Badge {...getStatusBadge(order.status)}>{getStatusBadge(order.status).label}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {order.license_plate} - {order.car_info}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(order.created_at).toLocaleDateString("vi-VN")}
                          </span>
                          {order.estimated_completion && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Hạn: {new Date(order.estimated_completion).toLocaleDateString("vi-VN")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {currentUser?.role !== "ktv" && (
                          <div className="w-full sm:w-48">
                            <Select
                              value={order.assigned_technician || "unassigned"}
                              onValueChange={(value) => assignTechnician(order.id, value)}
                              disabled={saving}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn KTV" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unassigned">Chưa phân công</SelectItem>
                                {technicians.map((tech) => (
                                  <SelectItem key={tech.id} value={tech.id}>
                                    {tech.full_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <Link href={getDetailLink(order)}>
                          <Button variant="outline" size="sm">
                            {getActionText(order.status)}
                          </Button>
                        </Link>
                      </div>
                    </div>
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