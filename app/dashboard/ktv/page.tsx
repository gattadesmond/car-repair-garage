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
    inProgress: 0,
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
    // Lọc các công việc đã được gán cho KTV hiện tại hoặc chưa được gán cho KTV nào
    const assignedOrders = workOrders.filter(
      (order) => {
        // Hiển thị các công việc đã được gán cho KTV hiện tại
        const assignedToCurrentKTV = order.assigned_technician === user.id && order.status !== "delivered";
        
        // Hiển thị các công việc chưa được gán cho KTV nào và đang ở trạng thái pending
        const unassignedPending = !order.assigned_technician && order.status === "pending";
        
        return assignedToCurrentKTV || unassignedPending;
      }
    )

    const formattedTasks = assignedOrders.map((item) => ({
      ...item,
      preliminary_diagnosis: "Cần kiểm tra chi tiết hệ thống và đánh giá tình trạng",
      priority: "normal",
    }))

    // Sắp xếp theo trạng thái và thời gian
    formattedTasks.sort((a, b) => {
      // Ưu tiên theo trạng thái: pending > diagnosis > in_progress > completed
      const statusOrder: { [key: string]: number } = {
        pending: 0,
        diagnosis: 1,
        in_progress: 2,
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
      inProgress: formattedTasks.filter((t) => t.status === "in_progress").length,
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
      in_progress: { label: "Đang sửa", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  return (
    <DashboardLayout role="ktv" title="Dashboard Kỹ thuật viên">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Chờ kiểm tra</p>
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
                  <p className="text-sm font-medium">Đang sửa</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
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

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Quá hạn</p>
                  <p className="text-2xl font-bold">{stats.overdue}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/tasks">
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-orange-200">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-orange-600 rounded-full text-white group-hover:bg-orange-700 transition-colors">
                      <ClipboardList className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-orange-900">Xem công việc</h3>
                      <p className="text-sm text-orange-700 mt-1">Danh sách công việc được giao</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                    <ClipboardList className="h-12 w-12 text-orange-600" />
                  </div>
                </div>
              </Link>

              <Link href="/repair-orders">
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-blue-200">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-blue-600 rounded-full text-white group-hover:bg-blue-700 transition-colors">
                      <Wrench className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">Lệnh sửa chữa</h3>
                      <p className="text-sm text-blue-700 mt-1">Cập nhật tiến độ sửa chữa</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Wrench className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle>Công việc được giao</CardTitle>
            <CardDescription>Danh sách xe cần kiểm tra và sửa chữa</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Chưa có công việc nào được giao</div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{task.customer_name}</h4>
                          <Badge {...getStatusBadge(task.status)}>{getStatusBadge(task.status).label}</Badge>
                          <Badge {...getPriorityBadge(task.priority)}>{getPriorityBadge(task.priority).label}</Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {task.license_plate} - {task.car_info}
                        </p>

                        {task.preliminary_diagnosis && (
                          <p className="text-sm mb-2">
                            <span className="font-medium">Chẩn đoán:</span> {task.preliminary_diagnosis}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Giao: {new Date(task.created_at).toLocaleDateString("vi-VN")}</span>
                          {task.estimated_completion && (
                            <span>Hạn: {new Date(task.estimated_completion).toLocaleDateString("vi-VN")}</span>
                          )}
                        </div>
                      </div>

                      <div className="ml-4">
                        <Link href={task.status === "pending" || task.status === "diagnosis" ? `/diagnosis/ktv/${task.id}` : `/repair-order/${task.id}`}>
                          <Button size="sm">
                            {task.status === "pending" ? "Nhận công việc" :
                             task.status === "diagnosis" ? "Tiếp tục kiểm tra" :
                             task.status === "in_progress" ? "Cập nhật tiến độ" :
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
