"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Car, User, FileText, Calendar, Save, AlertTriangle, Settings, Wrench, CheckCircle } from "lucide-react"
import RoleLayout from "@/components/role-layout"
import { getWorkOrders, saveWorkOrders, getTechnicians, getCurrentUser, type WorkOrder, type Technician } from "@/lib/demo-data"

export default function AdminDiagnosisPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)

  const [diagnosisData, setDiagnosisData] = useState({
    technicianNotes: "",
    priority: "normal",
    specialInstructions: "",
    estimatedCompletion: ""
  })
  
  // State để lưu trữ thông tin phân công KTV cho từng task
  const [taskAssignments, setTaskAssignments] = useState<{[taskId: string]: string}>({})

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    
    // Kiểm tra nếu người dùng không phải là Admin, chuyển hướng về dashboard
    if (user?.role !== "admin") {
      router.push(`/dashboard/${user?.role || 'cv'}`)
      return
    }
    
    fetchWorkOrder()
    fetchTechnicians()
  }, [params.id])

  const fetchWorkOrder = () => {
    const workOrders = getWorkOrders()
    const order = workOrders.find((w) => w.id === params.id)

    if (order) {
      setWorkOrder(order)

      // Load existing diagnosis data if available
      const diagnosisKey = `diagnosis-${params.id}`
      const storedDiagnosis = localStorage.getItem(diagnosisKey)
      if (storedDiagnosis) {
        try {
          const parsedDiagnosis = JSON.parse(storedDiagnosis)
          setDiagnosisData(parsedDiagnosis)
        } catch (error) {
          console.error("Error parsing stored diagnosis:", error)
        }
      }

      // Nếu đã có kỹ thuật viên được gán từ form tiếp nhận, set làm mặc định
      if (order.assigned_technician) {
        setDiagnosisData((prev) => ({
          ...prev,
          assignedTechnician: order.assigned_technician || "",
        }))
      }
      
      // Khởi tạo giá trị cho taskAssignments từ các task đã có trong workOrder
      if (order.repair_tasks && Array.isArray(order.repair_tasks)) {
        const initialAssignments: {[taskId: string]: string} = {}
        order.repair_tasks.forEach(task => {
          if (task.id && task.assigned_technician) {
            initialAssignments[task.id] = task.assigned_technician
          }
        })
        setTaskAssignments(initialAssignments)
      }
    } else {
      setError("Không tìm thấy phiếu tiếp nhận")
    }
    setLoading(false)
  }

  const fetchTechnicians = () => {
    const techs = getTechnicians()
    setTechnicians(techs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      // Validate required fields
      if (!diagnosisData.technicianNotes) {
        setError("Vui lòng nhập ghi chú của kỹ thuật viên")
        setSaving(false)
        return
      }

      // Update work order with diagnosis info
      const workOrders = getWorkOrders()
      const orderIndex = workOrders.findIndex((w) => w.id === params.id)

      if (orderIndex !== -1) {
        // Xác định trạng thái mới - Admin đang duyệt chẩn đoán, xem như hoàn thành phần chẩn đoán
        const newStatus = "diagnosed"
        const successMessage = "Đã duyệt chẩn đoán và hoàn thành phần chẩn đoán"
        
        // Cập nhật thông tin phân công KTV cho từng task
        const updatedRepairTasks = workOrders[orderIndex].repair_tasks && Array.isArray(workOrders[orderIndex].repair_tasks) 
          ? workOrders[orderIndex].repair_tasks.map(task => {
              if (task.id && taskAssignments[task.id]) {
                return {
                  ...task,
                  assigned_technician: taskAssignments[task.id],
                  status: task.status || "pending"
                }
              }
              return task
            })
          : workOrders[orderIndex].repair_tasks
        
        workOrders[orderIndex] = {
          ...workOrders[orderIndex],
          status: newStatus,
          estimated_completion: diagnosisData.estimatedCompletion,
          updated_at: new Date().toISOString(),
          repair_tasks: updatedRepairTasks
        }
        saveWorkOrders(workOrders)

        // Save diagnosis data to localStorage
        const diagnosisKey = `diagnosis-${params.id}`
        localStorage.setItem(diagnosisKey, JSON.stringify(diagnosisData))
        
        setSuccess(successMessage)
      }
      
      router.push("/admin/dashboard")
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi lưu chẩn đoán")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <RoleLayout role="admin" title="Duyệt chẩn đoán">
        <div className="text-center py-8">Đang tải...</div>
      </RoleLayout>
    )
  }

  if (!workOrder) {
    return (
      <RoleLayout role="admin" title="Duyệt chẩn đoán">
        <Alert variant="destructive">
          <AlertDescription>Không tìm thấy phiếu tiếp nhận</AlertDescription>
        </Alert>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout role="admin" title="Duyệt chẩn đoán">
      <div className="space-y-6">
        {/* Work Order Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Thông tin phiếu tiếp nhận</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Khách hàng:</span>
                  <span>{workOrder.customer_name}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Car className="h-4 w-4" />
                  <span className="font-medium">Xe:</span>
                  <span>
                    {workOrder.car_info} - {workOrder.license_plate}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Ngày tiếp nhận:</span>
                  <span>{new Date(workOrder.received_date).toLocaleDateString("vi-VN")}</span>
                </div>
                {workOrder.assigned_technician && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">KTV được gán:</span>
                    <span>
                      {technicians.find((t) => t.id === workOrder.assigned_technician)?.full_name ||
                        workOrder.assigned_technician}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="mb-2">
                  <span className="font-medium">Yêu cầu khách hàng:</span>
                  <p className="text-sm text-gray-600 mt-1">{workOrder.customer_request}</p>
                </div>
                <div className="mb-2">
                  <span className="font-medium">Tình trạng ban đầu:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {workOrder.initial_condition.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {workOrder.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <span className="font-medium">Ghi chú:</span>
                <p className="text-sm mt-1">{workOrder.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diagnosis Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Technician Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>Ghi chú kỹ thuật viên</span>
              </CardTitle>
              <CardDescription>
                Ghi chú và nhận xét về tình trạng xe từ KTV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="technicianNotes"
                placeholder="Nhập ghi chú và nhận xét về tình trạng xe"
                value={diagnosisData.technicianNotes}
                onChange={(e) => setDiagnosisData((prev) => ({ ...prev, technicianNotes: e.target.value }))}
                className="mt-2"
                rows={6}
              />
            </CardContent>
          </Card>
          
          {/* Repair Tasks Assignment */}
          {workOrder.repair_tasks && workOrder.repair_tasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <span>Phân công công việc</span>
                </CardTitle>
                <CardDescription>Phân công kỹ thuật viên cho từng công việc sửa chữa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workOrder.repair_tasks.map((task, index) => (
                    <div key={task.id} className="p-4 border rounded-md">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {task.service_type === "cleaning" && "Dọn Dẹp"}
                              {task.service_type === "painting" && "Đồng Sơn"}
                              {task.service_type === "mechanical" && "Cơ"}
                              {task.service_type === "electrical" && "Điện"}
                              {task.service_type === "cooling" && "Lạnh"}
                            </Badge>
                            <h3 className="font-medium">{task.name}</h3>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-500">{task.description}</p>
                          )}
                        </div>
                        <div className="w-full md:w-64">
                          <Label htmlFor={`technician-${task.id}`}>Phân công KTV</Label>
                          <Select
                            value={taskAssignments[task.id] || ""}
                            onValueChange={(value) => {
                              setTaskAssignments(prev => ({
                                ...prev,
                                [task.id]: value
                              }))
                            }}
                          >
                            <SelectTrigger id={`technician-${task.id}`}>
                              <SelectValue placeholder="Chọn kỹ thuật viên" />
                            </SelectTrigger>
                            <SelectContent>
                              {technicians.map((tech) => (
                                <SelectItem key={tech.id} value={tech.id}>
                                  {tech.full_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assignment and Estimates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Thông tin bổ sung</span>
              </CardTitle>
              <CardDescription>Thông tin về độ ưu tiên và thời gian dự kiến</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Độ ưu tiên</Label>
                  <Select
                    value={diagnosisData.priority}
                    onValueChange={(value) => setDiagnosisData((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="normal">Bình thường</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="urgent">Khẩn cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estimatedCompletion">Thời gian hoàn thành dự kiến</Label>
                  <Input
                    id="estimatedCompletion"
                    type="date"
                    value={diagnosisData.estimatedCompletion}
                    onChange={(e) => setDiagnosisData((prev) => ({ ...prev, estimatedCompletion: e.target.value }))}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="specialInstructions">Hướng dẫn đặc biệt</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Các lưu ý đặc biệt, yêu cầu kỹ thuật, thứ tự thực hiện..."
                  value={diagnosisData.specialInstructions}
                  onChange={(e) => setDiagnosisData((prev) => ({ ...prev, specialInstructions: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </div>
            </Alert>
          )}
          
          <div className="flex space-x-4">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                "Đang lưu..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Xác nhận & Hoàn thành chẩn đoán
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Quay lại
            </Button>
          </div>
        </form>
      </div>
    </RoleLayout>
  )
}