"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Clock, CheckCircle, AlertCircle, ClipboardList, Wrench, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import RoleLayout from "@/components/role-layout"
import { getWorkOrders, getCurrentUser, type WorkOrder } from "@/lib/demo-data"

interface Task extends WorkOrder {
  task_id: string
  task_status: string
  preliminary_diagnosis: string
  priority: string
  service_type?: string
  name?: string
  description?: string
}

export default function KTVDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [stats, setStats] = useState({
    pending: 0,
    inInspection: 0,
    completed: 0,
    overdue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [filter, search])

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

    // Tạo danh sách các task từ các repair_tasks trong work orders
    let formattedTasks: Task[] = [];
    
    assignedOrders.forEach((order) => {
      if (order.repair_tasks && order.repair_tasks.length > 0) {
        // Lọc các task được gán cho KTV hiện tại
        const tasksForKtv = order.repair_tasks.filter((task: any) => 
          task.assigned_technician === user.id
        ).map((task: any) => ({
          ...order,
          task_id: task.id, // Lưu ID của task
          preliminary_diagnosis: "Cần kiểm tra chi tiết hệ thống và đánh giá tình trạng",
          priority: "normal",
          service_type: task.service_type || "mechanical",
          name: task.name || "",
          description: task.description || "",
          task_status: task.status || "pending"
        }));
        
        formattedTasks = [...formattedTasks, ...tasksForKtv];
      }
    });

    // Sắp xếp theo trạng thái và thời gian
    formattedTasks.sort((a, b) => {
      // Ưu tiên theo trạng thái: pending > in_progress > completed
      const statusOrder: { [key: string]: number } = {
        pending: 0,
        in_progress: 1,
        completed: 2,
      }

      const statusA = statusOrder[a.task_status] ?? 999
      const statusB = statusOrder[b.task_status] ?? 999

      if (statusA !== statusB) {
        return statusA - statusB
      }

      // Nếu cùng trạng thái, sắp xếp theo thời gian tạo (mới nhất lên đầu)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    // Lọc theo trạng thái nếu cần
    let filteredTasks = formattedTasks;
    if (filter !== "all") {
      filteredTasks = formattedTasks.filter(task => {
        if (filter === "pending") return task.task_status === "pending";
        if (filter === "in_progress") return task.task_status === "in_progress";
        if (filter === "completed") return task.task_status === "completed";
        return true;
      });
    }
    
    // Lọc theo từ khóa tìm kiếm nếu có
    if (search.trim() !== "") {
      const query = search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.customer_name?.toLowerCase().includes(query) ||
        task.license_plate?.toLowerCase().includes(query) ||
        task.car_info?.toLowerCase().includes(query) ||
        task.name?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }
    
    setTasks(filteredTasks)

    // Calculate stats
    const now = new Date()
    setStats({
      pending: formattedTasks.filter((t) => t.task_status === "pending").length,
      inInspection: formattedTasks.filter((t) => t.task_status === "in_progress").length,
      completed: formattedTasks.filter((t) => t.task_status === "completed").length,
      overdue: formattedTasks.filter(
        (t) => t.estimated_completion && new Date(t.estimated_completion) < now && t.task_status !== "completed",
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
  
  const getServiceTypeBadge = (serviceType: string) => {
    const typeMap = {
      cleaning: { label: "Dọn Dẹp", variant: "outline" as const, color: "bg-blue-100 text-blue-800" },
      painting: { label: "Đồng Sơn", variant: "outline" as const, color: "bg-orange-100 text-orange-800" },
      mechanical: { label: "Cơ", variant: "outline" as const, color: "bg-green-100 text-green-800" },
      electrical: { label: "Điện", variant: "outline" as const, color: "bg-purple-100 text-purple-800" },
      cooling: { label: "Lạnh", variant: "outline" as const, color: "bg-cyan-100 text-cyan-800" },
    }
    return typeMap[serviceType as keyof typeof typeMap] || { label: serviceType, variant: "outline" as const, color: "" }
  }

  return (
    <RoleLayout role="ktv" title="Dashboard Kỹ thuật viên">
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

      

        {/* Tasks List */}
        <Card className="mx-4">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="h-5 w-5" />
              <span>Danh sách công việc</span>
            </CardTitle>
            <CardDescription>Quản lý công việc được giao</CardDescription>
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
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="search">Tìm kiếm</Label>
                <Input 
                  id="search" 
                  placeholder="Tìm theo tên KH, biển số..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Không có công việc nào được giao</div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getServiceTypeBadge(task.service_type || "mechanical").color}>
                            {getServiceTypeBadge(task.service_type || "mechanical").label}
                          </Badge>
                          <h4 className="font-medium">{task.name || `Công việc #${task.task_id}`}</h4>
                          <Badge {...getStatusBadge(task.task_status)}>
                            {getStatusBadge(task.task_status).label}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-1">
                          {task.license_plate} - {task.car_info} | Khách hàng: {task.customer_name}
                        </p>
                        
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(task.created_at).toLocaleDateString("vi-VN")}
                          </span>
                          {task.estimated_completion && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Hạn: {new Date(task.estimated_completion).toLocaleDateString("vi-VN")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Link href={`/ktv/tasks/${task.task_id}`}>
                          <Button variant="outline" size="sm">
                            Xem chi tiết
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
    </RoleLayout>
  )
}