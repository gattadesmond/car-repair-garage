"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Wrench, Save, CheckCircle, Clock, FileText, Car, User } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { getWorkOrders, saveWorkOrders, getCurrentUser, getTechnicians, type WorkOrder, type RepairTask, type Technician } from "@/lib/demo-data"
import Link from "next/link"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [task, setTask] = useState<RepairTask | null>(null)
  const [taskStatus, setTaskStatus] = useState<string>("") 
  const [taskNotes, setTaskNotes] = useState<string>("") 
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [assignedTechnician, setAssignedTechnician] = useState<string>("") 

  useEffect(() => {
    fetchData()
  }, [params.id])

  const fetchData = () => {
    const user = getCurrentUser()
    setCurrentUser(user)

    const techs = getTechnicians()
    setTechnicians(techs)

    // Tìm task theo ID
    const orders = getWorkOrders()
    let foundTask: RepairTask | null = null
    let foundOrder: WorkOrder | null = null

    // Tìm kiếm task trong tất cả các work order
    for (const order of orders) {
      if (order.repair_tasks && Array.isArray(order.repair_tasks)) {
        const task = order.repair_tasks.find(t => t.id === params.id)
        if (task) {
          foundTask = task
          foundOrder = order
          break
        }
      }
    }

    if (foundTask && foundOrder) {
      setWorkOrder(foundOrder)
      setTask(foundTask)
      setTaskStatus(foundTask.status || "pending")
      setTaskNotes(foundTask.notes || "")
      setAssignedTechnician(foundTask.assigned_technician || "unassigned")
      setLoading(false)
    } else {
      setError("Không tìm thấy công việc")
      setLoading(false)
    }
  }

  const handleSaveTask = () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      if (!workOrder || !task) {
        setError("Không tìm thấy thông tin công việc")
        setSaving(false)
        return
      }

      const orders = getWorkOrders()
      const orderIndex = orders.findIndex(o => o.id === workOrder.id)

      if (orderIndex === -1) {
        setError("Không tìm thấy phiếu sửa chữa")
        setSaving(false)
        return
      }

      // Cập nhật task trong work order
      if (orders[orderIndex].repair_tasks) {
        orders[orderIndex].repair_tasks = orders[orderIndex].repair_tasks!.map(t => {
          if (t.id === task.id) {
            return {
              ...t,
              status: taskStatus,
              notes: taskNotes,
              assigned_technician: assignedTechnician
            }
          }
          return t
        })
      }

      // Lưu thay đổi
      saveWorkOrders(orders)
      setSuccess("Đã cập nhật thông tin công việc")
      setSaving(false)

      // Cập nhật lại dữ liệu
      fetchData()
    } catch (err) {
      setError("Đã xảy ra lỗi khi lưu thông tin")
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return { variant: "outline", label: "Hoàn thành", color: "bg-green-100 text-green-800 hover:bg-green-100" }
      case "in_progress":
        return { variant: "outline", label: "Đang thực hiện", color: "bg-blue-100 text-blue-800 hover:bg-blue-100" }
      case "pending":
      default:
        return { variant: "outline", label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" }
    }
  }

  const getServiceTypeBadge = (type: string) => {
    switch (type) {
      case "cleaning":
        return { label: "Dọn dẹp", color: "bg-blue-100 text-blue-800" }
      case "mechanical":
        return { label: "Cơ", color: "bg-amber-100 text-amber-800" }
      case "electrical":
        return { label: "Điện", color: "bg-purple-100 text-purple-800" }
      case "painting":
        return { label: "Đồng sơn", color: "bg-red-100 text-red-800" }
      case "ac":
        return { label: "Lạnh", color: "bg-cyan-100 text-cyan-800" }
      default:
        return { label: "Khác", color: "bg-gray-100 text-gray-800" }
    }
  }

  return (
    <DashboardLayout role={currentUser?.role || "admin"} title="Chi tiết công việc">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/tasks">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          {task && (
            <Badge className={getStatusBadge(task.status || "pending").color}>
              {getStatusBadge(task.status || "pending").label}
            </Badge>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : !task || !workOrder ? (
          <div className="text-center py-8 text-gray-500">Không tìm thấy thông tin công việc</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Thông tin công việc */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5" />
                  <span>Thông tin công việc</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getServiceTypeBadge(task.service_type).color}>
                      {getServiceTypeBadge(task.service_type).label}
                    </Badge>
                    <h3 className="text-lg font-semibold">{task.name}</h3>
                  </div>
                  {task.description && (
                    <p className="text-gray-600">{task.description}</p>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Cập nhật trạng thái</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select value={taskStatus} onValueChange={setTaskStatus}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Chờ xử lý</SelectItem>
                          <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {currentUser?.role !== "ktv" && (
                      <div>
                        <Label htmlFor="technician">Kỹ thuật viên</Label>
                        <Select value={assignedTechnician} onValueChange={setAssignedTechnician}>
                          <SelectTrigger id="technician">
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

                    <div>
                      <Label htmlFor="notes">Ghi chú</Label>
                      <Textarea
                        id="notes"
                        placeholder="Nhập ghi chú về công việc"
                        value={taskNotes}
                        onChange={(e) => setTaskNotes(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button 
                      onClick={handleSaveTask} 
                      disabled={saving} 
                      className="w-full sm:w-auto"
                    >
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                      <Save className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin xe và khách hàng */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Thông tin phiếu sửa chữa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium flex items-center mb-2">
                    <Car className="h-4 w-4 mr-2" />
                    Thông tin xe
                  </h4>
                  <div className="text-sm space-y-1 pl-6">
                    <p><span className="text-gray-500">Biển số:</span> {workOrder.license_plate}</p>
                    <p><span className="text-gray-500">Loại xe:</span> {workOrder.car_info}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium flex items-center mb-2">
                    <User className="h-4 w-4 mr-2" />
                    Thông tin khách hàng
                  </h4>
                  <div className="text-sm space-y-1 pl-6">
                    <p><span className="text-gray-500">Tên:</span> {workOrder.customer_name}</p>
                    <p><span className="text-gray-500">SĐT:</span> {workOrder.customer_phone || "Không có"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    Thời gian
                  </h4>
                  <div className="text-sm space-y-1 pl-6">
                    <p>
                      <span className="text-gray-500">Ngày tạo:</span>{" "}
                      {new Date(workOrder.created_at).toLocaleDateString("vi-VN")}
                    </p>
                    {workOrder.estimated_completion && (
                      <p>
                        <span className="text-gray-500">Dự kiến hoàn thành:</span>{" "}
                        {new Date(workOrder.estimated_completion).toLocaleDateString("vi-VN")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/work-orders/${workOrder.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Xem phiếu sửa chữa đầy đủ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}