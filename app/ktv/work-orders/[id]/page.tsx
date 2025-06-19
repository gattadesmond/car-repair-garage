"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Car, User, FileText, Calendar, ArrowLeft, Edit, Camera, Eye, Save, Wrench } from "lucide-react"
import Link from "next/link"
import RoleLayout from "@/components/role-layout"
import { getWorkOrders, getTechnicians, saveWorkOrders, getCurrentUser, type WorkOrder, type Technician } from "@/lib/demo-data"

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
    if (!user || user.role !== "ktv") {
      router.push("/login")
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
    const imageKey = `images-${params.id}`
    const storedImages = localStorage.getItem(imageKey)
    if (storedImages) {
      try {
        const parsedImages = JSON.parse(storedImages)
        setImages(parsedImages)
      } catch (error) {
        console.error("Error parsing images:", error)
      }
    }
  }

  const viewImage = (imageData: string) => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`<img src="${imageData}" style="max-width: 100%; height: auto;" />`)
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Chờ xử lý", variant: "secondary" as const },
      diagnosis: { label: "Chẩn đoán", variant: "outline" as const },
      in_inspection: { label: "Đang kiểm tra", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
      delivered: { label: "Đã giao", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  const getNextAction = (order: WorkOrder) => {
    switch (order.status) {
      case "pending":
        return {
          href: `/ktv/diagnosis/${order.id}`,
          label: "Bắt đầu chẩn đoán",
          variant: "default" as const,
        }
      case "diagnosis":
        return {
          href: `/ktv/diagnosis/${order.id}`,
          label: "Tiếp tục chẩn đoán",
          variant: "default" as const,
        }

      default:
        return null
    }
  }

  if (loading) {
    return (
      <RoleLayout role="ktv" title="Chi tiết phiếu tiếp nhận">
        <div className="text-center py-8">Đang tải...</div>
      </RoleLayout>
    )
  }

  if (!workOrder) {
    return (
      <RoleLayout role="ktv" title="Chi tiết phiếu tiếp nhận">
        <Alert variant="destructive">
          <AlertDescription>Không tìm thấy phiếu tiếp nhận</AlertDescription>
        </Alert>
      </RoleLayout>
    )
  }

  const nextAction = getNextAction(workOrder)

  return (
    <RoleLayout role="ktv" title="Chi tiết phiếu tiếp nhận">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center space-x-2">
            <Badge {...getStatusBadge(workOrder.status)}>{getStatusBadge(workOrder.status).label}</Badge>
            {nextAction && (
              <Link href={nextAction.href}>
                <Button variant={nextAction.variant}>
                  <Edit className="h-4 w-4 mr-2" />
                  {nextAction.label}
                </Button>
              </Link>
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
            <CardDescription>Mã phiếu: {workOrder.id}</CardDescription>
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
                    <div className="flex items-center space-x-2">
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
                    )}
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
        {workOrder.admin_notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Ghi chú của Admin</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{workOrder.admin_notes}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Assigned Tasks */}
        {workOrder.repair_tasks && workOrder.repair_tasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                <span>Công việc được giao</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workOrder.repair_tasks
                  .filter(task => task.assigned_technician === currentUser?.id)
                  .map((task, index) => (
                    <div key={task.id} className="p-4 border rounded-md">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {task.service_type === "cleaning" && "Dọn Dẹp"}
                            {task.service_type === "painting" && "Đồng Sơn"}
                            {task.service_type === "mechanical" && "Cơ"}
                            {task.service_type === "electrical" && "Điện"}
                            {task.service_type === "ac" && "Hết"}
                          </Badge>
                          <h3 className="font-medium">{task.name}</h3>
                          <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                            {task.status === "pending" && "Chờ xử lý"}
                            {task.status === "in_progress" && "Đang thực hiện"}
                            {task.status === "completed" && "Hoàn thành"}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-500">{task.description}</p>
                        )}
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => router.push(`/ktv/tasks/${task.id}`)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                {workOrder.repair_tasks.filter(task => task.assigned_technician === currentUser?.id).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Không có công việc nào được giao cho bạn
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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