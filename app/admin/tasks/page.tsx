"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Car, Clock, CheckCircle, AlertCircle, ClipboardList, Wrench, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import RoleLayout from "@/components/role-layout"
import TaskItem from "@/components/task-item"
import { getWorkOrders, getTechnicians, saveWorkOrders, getCurrentUser, type WorkOrder, type Technician, type RepairTask } from "@/lib/demo-data"

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<(RepairTask & { work_order_id: string, car_info: string, license_plate: string, customer_name: string })[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [user, setUser] = useState<any>(null)
  const [filter, setFilter] = useState("all")
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
  }, [filter])

  const fetchData = () => {
    const orders = getWorkOrders()
    const techs = getTechnicians()
    let allTasks: (RepairTask & { work_order_id: string, car_info: string, license_plate: string, customer_name: string })[] = []
    
    // Lấy tất cả các task từ tất cả các work order
    orders.forEach(order => {
      if (order.repair_tasks && Array.isArray(order.repair_tasks)) {
        const tasksFromOrder = order.repair_tasks.map((task: RepairTask) => ({
          ...task,
          work_order_id: order.id,
          car_info: order.car_info,
          license_plate: order.license_plate,
          customer_name: order.customer_name,
          created_at: task.created_at || order.created_at,
          estimated_completion: order.estimated_completion
        }));
        
        allTasks = [...allTasks, ...tasksFromOrder];
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

    setTasks(allTasks)
    setTechnicians(techs)
    setLoading(false)
  }

  const assignTechnician = (taskId: string, workOrderId: string, technicianId: string) => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const orders = getWorkOrders()
      const orderIndex = orders.findIndex((o) => o.id === workOrderId)

      if (orderIndex !== -1 && orders[orderIndex].repair_tasks) {
        // Cập nhật task trong work order
        const updatedTasks = orders[orderIndex].repair_tasks!.map((task: RepairTask) => {
          if (task.id === taskId) {
            return {
              ...task,
              assigned_technician: technicianId === "unassigned" ? "" : technicianId,
              updated_at: new Date().toISOString(),
            }
          }
          return task
        })

        orders[orderIndex] = {
          ...orders[orderIndex],
          repair_tasks: updatedTasks,
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
      ac: { label: "Hết", variant: "outline" as const, color: "bg-cyan-100 text-cyan-800" },
    }
    return typeMap[serviceType as keyof typeof typeMap] || { label: serviceType, variant: "outline" as const, color: "" }
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <RoleLayout role="admin" title="Quản lý công việc">
      <div className="space-y-6">
        {/* Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="h-5 w-5" />
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
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Không có công việc nào</div>
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
                        work_order_id: task.work_order_id,
                        notes: task.notes
                      }}
                      car_info={task.car_info}
                      license_plate={task.license_plate}
                      customer_name={task.customer_name}
                      technician={task.assigned_technician ? {
                        id: task.assigned_technician,
                        name: technicians.find(t => t.id === task.assigned_technician)?.full_name || "Không xác định",
                        full_name: technicians.find(t => t.id === task.assigned_technician)?.full_name
                      } : null}
                      detailsUrl={`/work-orders/${task.work_order_id}`}
                      actionElement={
                        <div className="mt-4 md:mt-0 w-full md:w-48">
                          <Select
                            value={task.assigned_technician || "unassigned"}
                            onValueChange={(value) => assignTechnician(task.id, task.work_order_id, value)}
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
                      }
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