"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Wrench, Save, CheckCircle, Clock, FileText, Camera } from "lucide-react"
import RoleLayout from "@/components/role-layout"
import ImageUpload from "@/components/image-upload"
import { getWorkOrders, saveWorkOrders, getCurrentUser, ImageFile } from "@/lib/demo-data"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [workOrder, setWorkOrder] = useState<any>(null)
  const [task, setTask] = useState<any>(null)
  const [taskStatus, setTaskStatus] = useState<string>("")
  const [taskNotes, setTaskNotes] = useState<string>("")
  const [taskImages, setTaskImages] = useState<ImageFile[]>([])

  useEffect(() => {
    fetchData()
  }, [params.id])

  const fetchData = () => {
    const user = getCurrentUser()
    setCurrentUser(user)

    // Kiểm tra nếu người dùng không phải là KTV, chuyển hướng về dashboard
    if (user?.role !== "ktv") {
      router.push(`/dashboard/${user?.role || 'cv'}`)
      return
    }

    // Tìm task trong tất cả các work order
    const workOrders = getWorkOrders()
    let foundTask = null
    let foundWorkOrder = null

    for (const order of workOrders) {
      if (order.repair_tasks && Array.isArray(order.repair_tasks)) {
        const task = order.repair_tasks.find((t: any) => t.id === params.id)
        if (task) {
          foundTask = task
          foundWorkOrder = order
          break
        }
      }
    }

    if (foundTask && foundWorkOrder) {
      // Kiểm tra xem task có được gán cho KTV hiện tại không
      if (foundTask.assigned_technician !== user?.id) {
        setError("Bạn không được phân công cho công việc này")
        setLoading(false)
        return
      }

      setWorkOrder(foundWorkOrder)
      setTask(foundTask)
      setTaskStatus(foundTask.status || "pending")
      setTaskNotes(foundTask.notes || "")
      setTaskImages(foundTask.task_images || [])
    } else {
      setError("Không tìm thấy công việc")
    }

    setLoading(false)
  }

  const handleSaveTask = () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const workOrders = getWorkOrders()
      const orderIndex = workOrders.findIndex((o) => o.id === workOrder.id)

      if (orderIndex !== -1 && workOrders[orderIndex].repair_tasks) {
        // Cập nhật task trong work order
        const updatedTasks = workOrders[orderIndex].repair_tasks.map((t: any) => {
          if (t.id === task.id) {
            return {
              ...t,
              status: taskStatus,
              notes: taskNotes,
              task_images: taskImages,
              updated_at: new Date().toISOString()
            }
          }
          return t
        })

        workOrders[orderIndex] = {
          ...workOrders[orderIndex],
          repair_tasks: updatedTasks,
          updated_at: new Date().toISOString()
        }

        saveWorkOrders(workOrders)
        setSuccess("Đã cập nhật công việc thành công")
        
        // Cập nhật state
        setTask({
          ...task,
          status: taskStatus,
          notes: taskNotes,
          task_images: taskImages,
          updated_at: new Date().toISOString()
        })
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật công việc")
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

  if (loading) {
    return (
      <RoleLayout role="ktv" title="Chi tiết công việc">
        <div className="text-center py-8">Đang tải...</div>
      </RoleLayout>
    )
  }

  if (error && !task) {
    return (
      <RoleLayout role="ktv" title="Chi tiết công việc">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout role="ktv" title="Chi tiết công việc">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center space-x-2">
            {task && <Badge {...getStatusBadge(task.status || "pending")}>{getStatusBadge(task.status || "pending").label}</Badge>}
          </div>
        </div>

        {/* Task Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <span>Thông tin công việc</span>
            </CardTitle>
            <CardDescription>
              Thuộc phiếu tiếp nhận: {workOrder?.id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {task?.service_type === "cleaning" && "Dọn Dẹp"}
                  {task?.service_type === "painting" && "Đồng Sơn"}
                  {task?.service_type === "mechanical" && "Cơ"}
                  {task?.service_type === "electrical" && "Điện"}
                  {task?.service_type === "cooling" && "Lạnh"}
                </Badge>
                <h3 className="text-lg font-medium">{task?.name}</h3>
              </div>
              
              {task?.description && (
                <div className="mt-2">
                  <p className="text-gray-600">{task.description}</p>
                </div>
              )}

              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Thông tin xe</h4>
                    <div className="space-y-1">
                      <p>{workOrder?.car_info} - {workOrder?.license_plate}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Thông tin khách hàng</h4>
                    <div className="space-y-1">
                      <p>{workOrder?.customer_name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-green-600" />
              <span>Hình ảnh xe</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload 
              images={taskImages} 
              onImagesChange={setTaskImages} 
              maxImages={10} 
              label="Hình ảnh xe"
            />
          </CardContent>
        </Card>

        {/* Update Task Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Cập nhật trạng thái</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Trạng thái công việc</label>
                <Select value={taskStatus} onValueChange={setTaskStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Ghi chú</label>
                <Textarea
                  placeholder="Nhập ghi chú về công việc"
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  rows={4}
                />
              </div>

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

              <Button 
                onClick={handleSaveTask} 
                disabled={saving} 
                className="w-full"
              >
                {saving ? (
                  "Đang lưu..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}