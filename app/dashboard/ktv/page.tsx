"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Clock, CheckCircle, AlertCircle, ClipboardList, Wrench } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { getWorkOrders, getCurrentUser, type WorkOrder } from "@/lib/demo-data"

interface Task extends WorkOrder {
  preliminary_diagnosis: string
  priority: string
}

export default function KTVDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState({
    pending: 0,
    inInspection: 0,
    completed: 0,
    overdue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = () => {
    const user = getCurrentUser()
    if (!user) return

    const workOrders = getWorkOrders()
    // Chỉ lọc các công việc đã được gán cho KTV hiện tại
    const assignedOrders = workOrders.filter(
      (order) => {
        // Chỉ hiển thị các công việc đã được gán cho KTV hiện tại
        return order.assigned_technician === user.id && order.status !== "delivered";
      }
    )

    const formattedTasks = assignedOrders.map((item) => ({
      ...item,
      preliminary_diagnosis: "Cần kiểm tra chi tiết hệ thống và đánh giá tình trạng",
      priority: "normal",
    }))

    // Sắp xếp theo trạng thái và thời gian
    formattedTasks.sort((a, b) => {
      // Ưu tiên theo trạng thái: pending > diagnosis > in_inspection > completed
      const statusOrder: { [key: string]: number } = {
        pending: 0,
        diagnosis: 1,
        in_inspection: 2,
        completed: 3,
      }

      const statusA = statusOrder[a.status] ?? 999
      const statusB = statusOrder[b.status] ?? 999

      if (statusA !== statusB) {
        return statusA - statusB
      }

      // Nếu cùng trạng thái, sắp xếp theo thời gian tạo (mới nhất lên đầu)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    setTasks(formattedTasks)

    // Calculate stats
    const now = new Date()
    setStats({
      pending: formattedTasks.filter((t) => t.status === "diagnosis" || t.status === "pending").length,
      inInspection: formattedTasks.filter((t) => t.status === "in_inspection").length,
      completed: formattedTasks.filter((t) => t.status === "completed").length,
      overdue: formattedTasks.filter(
        (t) => t.estimated_completion && new Date(t.estimated_completion) < now && t.status !== "completed",
      ).length,
    })

    setLoading(false)
  }

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      low: { label: "Thấp", variant: "secondary" as const },
      normal: { label: "Bình thường", variant: "outline" as const },
      high: { label: "Cao", variant: "default" as const },
      urgent: { label: "Khẩn cấp", variant: "destructive" as const },
    }
    return priorityMap[priority as keyof typeof priorityMap] || { label: priority, variant: "outline" as const }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      diagnosis: { label: "Chờ kiểm tra", variant: "secondary" as const },
      in_inspection: { label: "Đang kiểm tra", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  return (
    <DashboardLayout role="ktv" title="Dashboard Kỹ thuật viên">
      <div 
        className="space-y-6 relative pb-6"
        style={{
          backgroundImage: "url('/images/car-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
        }}
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-orange-200/50 transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">Chờ kiểm tra</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <div className="p-3 bg-orange-200 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Đang kiểm tra</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inInspection}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-green-200/50 transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Hoàn thành</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg hover:shadow-red-200/50 transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Quá hạn</p>
                  <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <div className="p-3 bg-red-200 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 mx-4">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <Wrench className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle>Thao tác nhanh</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">

              <Link href="/repair-orders" className="block">
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-blue-200 h-full">
                  <div className="flex md:flex-row items-center md:justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white group-hover:from-blue-600 group-hover:to-blue-700 transition-colors shadow-lg shadow-blue-200/50">
                        <Wrench className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 text-lg">Lệnh sửa chữa</h3>
                        <p className="text-sm text-blue-700 mt-1">Cập nhật tiến độ sửa chữa</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white/80 border-blue-200 text-blue-700 group-hover:bg-blue-50 transition-colors mt-4 md:mt-0">
                      Cập nhật ngay
                    </Badge>
                  </div>
                  <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wrench className="h-32 w-32 text-blue-900" />
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 mx-4">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Công việc được giao</CardTitle>
                <CardDescription>Danh sách xe cần kiểm tra và sửa chữa</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList className="h-8 w-8 text-blue-300" />
                </div>
                <p className="text-gray-500 font-medium">Chưa có công việc nào được giao</p>
                <p className="text-sm text-gray-400 mt-1">Các công việc mới sẽ xuất hiện ở đây</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="border border-blue-100 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200 hover:border-blue-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-medium text-blue-900">{task.customer_name}</h4>
                          <Badge 
                            {...getStatusBadge(task.status)} 
                            className="shadow-sm"
                          >
                            {getStatusBadge(task.status).label}
                          </Badge>
                          <Badge 
                            {...getPriorityBadge(task.priority)} 
                            className="shadow-sm"
                          >
                            {getPriorityBadge(task.priority).label}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                          <Car className="h-4 w-4 text-blue-500" />
                          <p className="text-sm text-gray-600">
                            {task.license_plate} - {task.car_info}
                          </p>
                        </div>

                        {task.preliminary_diagnosis && (
                          <div className="bg-blue-50 p-2 rounded-md mb-2">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Chẩn đoán:</span> {task.preliminary_diagnosis}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Giao: {new Date(task.created_at).toLocaleDateString("vi-VN")}</span>
                          </div>
                          {task.estimated_completion && (
                            <div className="flex items-center space-x-1">
                              <AlertCircle className="h-3 w-3" />
                              <span>Hạn: {new Date(task.estimated_completion).toLocaleDateString("vi-VN")}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-4">
                        <Link href={task.status === "pending" || task.status === "diagnosis" ? `/diagnosis/ktv/${task.id}` : `/repair-order/${task.id}`}>
                          <Button 
                            size="sm"
                            className={`shadow-md ${task.status === "pending" ? "bg-orange-600 hover:bg-orange-700" : 
                                       task.status === "diagnosis" ? "bg-blue-600 hover:bg-blue-700" :
                                       task.status === "in_inspection" ? "bg-green-600 hover:bg-green-700" :
                                       "bg-gray-600 hover:bg-gray-700"}`}
                          >
                            {task.status === "pending" ? "Nhận công việc" :
                             task.status === "diagnosis" ? "Tiếp tục kiểm tra & Chuyển CV" :
                             task.status === "in_inspection" ? "Cập nhật tiến độ" :
                             "Xem chi tiết"}
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
