"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Car, User, FileText, Calendar, ClipboardList, CheckCircle, Clock, Wrench } from "lucide-react"
import Link from "next/link"
import RoleLayout from "@/components/role-layout"
import TaskItem from "@/components/task-item"
import { getWorkOrders, getTechnicians, saveWorkOrders, getCurrentUser, type WorkOrder, type Technician } from "@/lib/demo-data"

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [filter, setFilter] = useState("all")
  const [technicians, setTechnicians] = useState<any[]>([])

  useEffect(() => {
    fetchData()
    setTechnicians(getTechnicians())
  }, [filter])

  const fetchData = () => {
    const user = getCurrentUser()
    setCurrentUser(user)

    // Kiểm tra nếu người dùng không phải là KTV, chuyển hướng về dashboard
    if (user?.role !== "ktv") {
      router.push(`/dashboard/${user?.role || 'cv'}`)
      return
    }

    const orders = getWorkOrders()
    let allTasks: any[] = []
    
    // Lấy tất cả các task được gán cho KTV hiện tại từ tất cả các work order
    orders.forEach(order => {
      if (order.repair_tasks && Array.isArray(order.repair_tasks)) {
        const tasksForKtv = order.repair_tasks.filter((task: any) => 
          task.assigned_technician === user?.id
        ).map((task: any) => ({
          ...task,
          work_order_id: order.id,
          car_info: order.car_info,
          license_plate: order.license_plate,
          customer_name: order.customer_name,
          created_at: task.created_at || order.created_at,
          estimated_completion: order.estimated_completion
        }));
        
        allTasks = [...allTasks, ...tasksForKtv];
      }
    });
    
    // Lọc theo trạng thái nếu không phải "all"
    if (filter === "pending") {
      allTasks = allTasks.filter(task => task.status === "pending")
    } else if (filter === "in_progress") {
      allTasks = allTasks.filter(task => task.status === "in_progress")
    } else if (filter === "completed") {
      allTasks = allTasks.filter(task => task.status === "completed")
    }

    // Sắp xếp theo thời gian tạo, mới nhất lên đầu
    allTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    setTasks(allTasks);
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Đang chờ", variant: "secondary" as const },
      in_progress: { label: "Đang thực hiện", variant: "outline" as const },
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
    <RoleLayout role="ktv" title="Quản lý công việc">
      <div className="space-y-6">
        {/* Filter Controls */}
        <Card>
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
                <Input id="search" placeholder="Tìm theo tên KH, biển số..." />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Không có công việc nào được giao</div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="mb-4">
                    <TaskItem
                      task={{
                        id: task.id,
                        name: task.name,
                        description: task.description,
                        status: task.status || "pending",
                        service_type: task.service_type,
                        created_at: task.created_at,
                        estimated_completion: task.estimated_completion,
                        assigned_technician: task.assigned_technician,
                        work_order_id: task.work_order_id
                      }}
                      car_info={task.car_info}
                      license_plate={task.license_plate}
                      customer_name={task.customer_name}
                      technician={task.assigned_technician ? {
                        id: task.assigned_technician,
                        name: technicians.find(t => t.id === task.assigned_technician)?.full_name || "Không xác định",
                        full_name: technicians.find(t => t.id === task.assigned_technician)?.full_name
                      } : null}
                      detailsUrl={`/ktv/tasks/${task.id}`}
                    />
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