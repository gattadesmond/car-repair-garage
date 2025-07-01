"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Car, User, FileText, Calendar, ArrowLeft, Edit, Camera, Eye, Save, Wrench, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import RoleLayout from "@/components/role-layout"
import TaskItem from "@/components/task-item"
import { getWorkOrders, getTechnicians, saveWorkOrders, getCurrentUser, type WorkOrder, type Technician, type RepairTask } from "@/lib/demo-data"

interface SavedImage {
  id: string
  name: string
  type: "camera" | "upload"
  data: string // base64
  size: number
}

export default function WorkOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [images, setImages] = useState<SavedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isEditingAdminNotes, setIsEditingAdminNotes] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [savingNotes, setSavingNotes] = useState(false)
  const [noteError, setNoteError] = useState("")
  
  // State cho phần quản lý tác vụ
  const [selectedTask, setSelectedTask] = useState<RepairTask | null>(null)
  const [isEditingTask, setIsEditingTask] = useState(false)
  const [taskStatus, setTaskStatus] = useState<string>("") 
  const [taskNotes, setTaskNotes] = useState<string>("") 
  const [assignedTechnician, setAssignedTechnician] = useState<string>("") 
  const [savingTask, setSavingTask] = useState(false)
  const [taskError, setTaskError] = useState("")
  const [taskSuccess, setTaskSuccess] = useState("")

  useEffect(() => {
    fetchWorkOrder()
    fetchTechnicians()
    fetchImages()
    fetchCurrentUser()
  }, [params.id])

  useEffect(() => {
    if (workOrder?.admin_notes) {
      setAdminNotes(workOrder.admin_notes)
    }
  }, [workOrder])
  
  const fetchCurrentUser = () => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }
    
    // Kiểm tra quyền truy cập - chỉ cho phép CV và Admin xem trang này
    if (user.role !== "cv" && user.role !== "admin") {
      router.push(`/${user.role}/dashboard`)
      return
    }
    
    setCurrentUser(user)
  }

  const fetchWorkOrder = () => {
    const workOrders = getWorkOrders()
    const order = workOrders.find((w) => w.id === params.id)
    setWorkOrder(order || null)
    setLoading(false)
  }

  const fetchTechnicians = () => {
    const techs = getTechnicians()
    setTechnicians(techs)
  }

  const fetchImages = () => {
    try {
      const imageKey = `images-${params.id}`
      const storedImages = localStorage.getItem(imageKey)
      
      if (storedImages && storedImages.trim() !== '') {
        try {
          const parsedImages = JSON.parse(storedImages)
          
          // Kiểm tra xem dữ liệu có phải là mảng không
          if (Array.isArray(parsedImages)) {
            setImages(parsedImages)
          } else {
            console.warn("Stored images data is not an array, resetting to empty array")
            setImages([])
          }
        } catch (error) {
          console.warn("Error parsing images, resetting to empty array:", error)
          setImages([])
          
          // Xóa dữ liệu không hợp lệ khỏi localStorage
          localStorage.removeItem(imageKey)
        }
      } else {
        // Không có dữ liệu hoặc dữ liệu rỗng
        setImages([])
      }
    } catch (error) {
      // Xử lý lỗi truy cập localStorage (ví dụ: trong chế độ ẩn danh)
      console.warn("Error accessing localStorage:", error)
      setImages([])
    }
  }

  const viewImage = (imageData: string) => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Xem hình ảnh</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f0f0; }
              img { max-width: 100%; max-height: 90vh; object-fit: contain; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            </style>
          </head>
          <body>
            <img src="${imageData}" alt="Chi tiết hình ảnh" />
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  const handleSaveAdminNotes = () => {
    if (!adminNotes.trim()) {
      setNoteError("Vui lòng nhập ghi chú trước khi lưu")
      return
    }

    setSavingNotes(true)
    setNoteError("")

    try {
      // Lấy danh sách work orders hiện tại
      const workOrders = getWorkOrders()
      const orderIndex = workOrders.findIndex((w) => w.id === params.id)

      if (orderIndex !== -1) {
        // Cập nhật admin_notes cho work order
        workOrders[orderIndex] = {
          ...workOrders[orderIndex],
          admin_notes: adminNotes.trim(),
          updated_at: new Date().toISOString(),
        }

        // Lưu lại danh sách work orders
        saveWorkOrders(workOrders)

        // Cập nhật state
        setWorkOrder(workOrders[orderIndex])
        setIsEditingAdminNotes(false)
      }
    } catch (error: any) {
      setNoteError(error.message || "Có lỗi xảy ra khi lưu ghi chú")
    } finally {
      setSavingNotes(false)
    }
  }

  const handleSaveTask = () => {
    if (!selectedTask) return
    
    setSavingTask(true)
    setTaskError("")
    setTaskSuccess("")

    try {
      if (!workOrder) {
        setTaskError("Không tìm thấy thông tin đơn hàng")
        setSavingTask(false)
        return
      }

      const orders = getWorkOrders()
      const orderIndex = orders.findIndex(o => o.id === workOrder.id)

      if (orderIndex === -1) {
        setTaskError("Không tìm thấy phiếu sửa chữa")
        setSavingTask(false)
        return
      }

      // Cập nhật task trong work order
      if (orders[orderIndex].repair_tasks) {
        orders[orderIndex].repair_tasks = orders[orderIndex].repair_tasks!.map(t => {
          if (t.id === selectedTask.id) {
            return {
              ...t,
              status: taskStatus,
              notes: taskNotes,
              assigned_technician: assignedTechnician,
              updated_at: new Date().toISOString()
            }
          }
          return t
        })
      }

      // Lưu thay đổi
      saveWorkOrders(orders)
      setTaskSuccess("Đã cập nhật thông tin công việc")
      setSavingTask(false)

      // Cập nhật lại dữ liệu
      fetchWorkOrder()
      setIsEditingTask(false)
    } catch (err) {
      setTaskError("Đã xảy ra lỗi khi lưu thông tin")
      setSavingTask(false)
    }
  }
  
  const selectTaskForEdit = (task: RepairTask) => {
    setSelectedTask(task)
    setTaskStatus(task.status || "pending")
    setTaskNotes(task.notes || "")
    setAssignedTechnician(task.assigned_technician || "unassigned")
    setIsEditingTask(true)
    setTaskError("")
    setTaskSuccess("")
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Đang chờ", variant: "secondary" as const },
      diagnosis: { label: "Đang chuẩn đoán", variant: "outline" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }
  
  const getTaskStatusBadge = (status: string) => {
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
        return { label: "Hết", color: "bg-cyan-100 text-cyan-800" }
      default:
        return { label: "Khác", color: "bg-gray-100 text-gray-800" }
    }
  }

  const getNextAction = (order: WorkOrder) => {
    // Nếu người dùng là admin, hiển thị nút hoàn thành cho các trạng thái phù hợp
    if (currentUser?.role === "admin") {
      if (order.status === "pending" || order.status === "diagnosis") {
        return {
          href: `#`,
          label: "Hoàn thành",
          variant: "default" as const,
          onClick: () => handleCompleteWorkOrder(order.id)
        }
      }
      return null
    }
    // Đối với các vai trò khác, giữ nguyên luồng cũ
    // Đối với các vai trò khác
    switch (order.status) {
      case "pending":
        return {
          href: `/diagnosis/${order.id}`,
          label: "Bắt đầu chẩn đoán",
          variant: "default" as const,
        }
      case "diagnosis":
        return {
          href: `/diagnosis/${order.id}`,
          label: "Tiếp tục chẩn đoán",
          variant: "default" as const,
        }

      default:
        return null
    }
  }

  if (loading) {
    return (
      <RoleLayout role={["cv", "admin"]} title="Chi tiết phiếu tiếp nhận">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-700 font-medium">Đang tải...</p>
          </div>
        </div>
      </RoleLayout>
    )
  }

  if (!workOrder) {
    return (
      <RoleLayout role={["cv", "admin"]} title="Chi tiết phiếu tiếp nhận">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700">Không tìm thấy đơn sửa chữa</h2>
            <p className="text-gray-500 mt-2">Đơn sửa chữa này không tồn tại hoặc đã bị xóa</p>
            <Button
              className="mt-4"
              onClick={() => router.back()}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </RoleLayout>
    )
  }

  const handleCompleteWorkOrder = (orderId: string) => {
    try {
      // Lấy danh sách work orders hiện tại
      const workOrders = getWorkOrders()
      const orderIndex = workOrders.findIndex((w) => w.id === orderId)

      if (orderIndex !== -1) {
        let newStatus = "completed";
        let successMessage = "Đã hoàn thành";
        
        // Kiểm tra xem tất cả các subtask đã hoàn thành chưa
        const allTasksCompleted = currentOrder.repair_tasks && 
          Array.isArray(currentOrder.repair_tasks) && 
          currentOrder.repair_tasks.every(task => task.status === "completed");
        
        if (!allTasksCompleted) {
          // Cập nhật tất cả các subtask thành hoàn thành
          if (currentOrder.repair_tasks && Array.isArray(currentOrder.repair_tasks)) {
            currentOrder.repair_tasks = currentOrder.repair_tasks.map(task => ({
              ...task,
              status: "completed",
              updated_at: new Date().toISOString()
            }));
          }
        }
        // Cập nhật trạng thái work order
        // Cập nhật trạng thái work order thành hoàn thành
        workOrders[orderIndex] = {
          status: "completed",
          updated_at: new Date().toISOString(),
        }

        // Lưu lại danh sách work orders
        saveWorkOrders(workOrders)

        // Cập nhật state
        setWorkOrder(workOrders[orderIndex])
        
        alert(successMessage)
        alert("Đã hoàn thành")
      }
    } catch (error: any) {
      alert("Có lỗi xảy ra khi hoàn thành công việc")
    }
  }

  const nextAction = getNextAction(workOrder)

  return (
    <RoleLayout role={["cv", "admin"]} title="Chi tiết phiếu tiếp nhận">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center space-x-2">
            <Badge {...getStatusBadge(workOrder.status)}>{getStatusBadge(workOrder.status).label}</Badge>
            {nextAction && currentUser?.role !== "cv" && (
              currentUser?.role === "admin" && nextAction.onClick ? (
                <Button variant={nextAction.variant} onClick={nextAction.onClick}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {nextAction.label}
                </Button>
              ) : (
                <Link href={nextAction.href}>
                  <Button variant={nextAction.variant}>
                    <Edit className="h-4 w-4 mr-2" />
                    {nextAction.label}
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>

        {/* Work Order Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Thông tin phiếu tiếp nhận</span>
            </CardTitle>
            {/* <CardDescription>Mã phiếu: {workOrder.id}</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Tên:</span>
                      <span>{workOrder.customer_name}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Thông tin xe</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Biển số:</span>
                      <span>{workOrder.license_plate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Xe:</span>
                      <span>{workOrder.car_info}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Thông tin tiếp nhận</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Ngày tiếp nhận:</span>
                      <span>{new Date(workOrder.received_date).toLocaleDateString("vi-VN")}</span>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <span className="font-medium">Người tiếp nhận:</span>
                      <span>{workOrder.received_by}</span>
                    </div>
                    {workOrder.assigned_technician && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">KTV được gán:</span>
                        <span>
                          {technicians.find((t) => t.id === workOrder.assigned_technician)?.full_name ||
                            workOrder.assigned_technician}
                        </span>
                      </div>
                    )}
                    {workOrder.estimated_completion && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Dự kiến hoàn thành:</span>
                        <span>{new Date(workOrder.estimated_completion).toLocaleDateString("vi-VN")}</span>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Request */}
        <Card>
          <CardHeader>
            <CardTitle>Yêu cầu của khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{workOrder.customer_request}</p>
          </CardContent>
        </Card>

        {/* Initial Condition */}
        {workOrder.initial_condition && workOrder.initial_condition.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tình trạng xe ban đầu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {workOrder.initial_condition.map((condition, index) => (
                  <Badge key={index} variant="outline">
                    {condition}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Images */}
        {images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Ảnh hiện trạng xe ({images.length} ảnh)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <div className="aspect-square relative">
                      <img
                        src={image.data || "/placeholder.svg"}
                        alt={image.name}
                        className="w-full h-full object-cover rounded border"
                      />

                      {/* View Button */}
                      <div className="absolute top-1 right-1">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => viewImage(image.data)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute bottom-1 left-1">
                        <span className="text-xs bg-black bg-opacity-50 text-white px-1 rounded">
                          {image.type === "camera" ? "📷" : "📁"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                    <p className="text-xs text-gray-400">{(image.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

           {/* Repair Tasks */}
           <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="h-5 w-5" />
              <span>Danh sách công việc</span>
            </CardTitle>
            <CardDescription>Các công việc sửa chữa cần thực hiện</CardDescription>
          </CardHeader>
          <CardContent>
            {taskSuccess && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{taskSuccess}</AlertDescription>
              </Alert>
            )}

            {taskError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{taskError}</AlertDescription>
              </Alert>
            )}

            {!workOrder.repair_tasks || workOrder.repair_tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Chưa có công việc nào được thêm vào</div>
            ) : isEditingTask && selectedTask ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getServiceTypeBadge(selectedTask.service_type).color}>
                      {getServiceTypeBadge(selectedTask.service_type).label}
                    </Badge>
                    <h3 className="text-lg font-semibold">{selectedTask.name}</h3>
                  </div>
                  {selectedTask.description && (
                    <p className="text-gray-600 mb-4">{selectedTask.description}</p>
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

                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSaveTask} 
                        disabled={savingTask} 
                      >
                        {savingTask ? "Đang lưu..." : "Lưu thay đổi"}
                        <Save className="ml-2 h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditingTask(false);
                          setSelectedTask(null);
                        }}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {workOrder.repair_tasks.map((task) => (
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
                        work_order_id: workOrder.id,
                        notes: task.notes
                      }}
                      car_info={workOrder.car_info}
                      license_plate={workOrder.license_plate}
                      customer_name={workOrder.customer_name}
                      technician={task.assigned_technician ? {
                        id: task.assigned_technician,
                        name: technicians.find(t => t.id === task.assigned_technician)?.full_name || "Không xác định",
                        full_name: technicians.find(t => t.id === task.assigned_technician)?.full_name
                      } : null}
                      showNotes={true}
                      actionElement={
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => selectTaskForEdit(task)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Cập nhật
                        </Button>
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        {workOrder.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Ghi chú</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{workOrder.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Admin Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Ghi chú của Admin</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workOrder.admin_notes ? (
              <div className="space-y-4">
                <p className="text-gray-700">{workOrder.admin_notes}</p>
                {currentUser?.role === "admin" && (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditingAdminNotes(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa ghi chú
                  </Button>
                )}
              </div>
            ) : currentUser?.role === "admin" ? (
              <div className="space-y-4">
                <p className="text-gray-500 italic">Chưa có ghi chú nào từ admin.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingAdminNotes(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Thêm ghi chú
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 italic">Chưa có ghi chú nào từ admin.</p>
            )}

            {isEditingAdminNotes && currentUser?.role === "admin" && (
              <div className="mt-4 space-y-4">
                <Textarea
                  placeholder="Nhập ghi chú của admin"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
                <div className="flex space-x-2">
                  <Button onClick={handleSaveAdminNotes} disabled={savingNotes}>
                    {savingNotes ? "Đang lưu..." : "Lưu ghi chú"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditingAdminNotes(false);
                      setAdminNotes(workOrder.admin_notes || "");
                    }}
                  >
                    Hủy
                  </Button>
                </div>
                {noteError && (
                  <Alert variant="destructive">
                    <AlertDescription>{noteError}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử thay đổi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="font-medium">Phiếu được tạo</p>
                  <p className="text-sm text-gray-500">{new Date(workOrder.created_at).toLocaleString("vi-VN")}</p>
                </div>
              </div>
              {workOrder.updated_at !== workOrder.created_at && (
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div>
                    <p className="font-medium">Cập nhật gần nhất</p>
                    <p className="text-sm text-gray-500">{new Date(workOrder.updated_at).toLocaleString("vi-VN")}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}
