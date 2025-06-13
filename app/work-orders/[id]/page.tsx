"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Car, User, FileText, Calendar, ArrowLeft, Edit, Camera, Eye } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { getWorkOrders, getTechnicians, type WorkOrder, type Technician } from "@/lib/demo-data"

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

  useEffect(() => {
    fetchWorkOrder()
    fetchTechnicians()
    fetchImages()
  }, [params.id])

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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Chờ xử lý", variant: "secondary" as const },
      diagnosis: { label: "Chẩn đoán", variant: "outline" as const },
      quotation: { label: "Báo giá", variant: "outline" as const },
      approved: { label: "Đã duyệt", variant: "default" as const },
      in_progress: { label: "Đang sửa", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
      delivered: { label: "Đã giao", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  const getNextAction = (order: WorkOrder) => {
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
      case "quotation":
        return {
          href: `/quotations/${order.id}/edit`,
          label: "Lập báo giá",
          variant: "default" as const,
        }
      case "approved":
        return {
          href: `/quotations/${order.id}`,
          label: "Xem báo giá",
          variant: "outline" as const,
        }
      default:
        return null
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="cv" title="Chi tiết phiếu tiếp nhận">
        <div className="text-center py-8">Đang tải...</div>
      </DashboardLayout>
    )
  }

  if (!workOrder) {
    return (
      <DashboardLayout role="cv" title="Chi tiết phiếu tiếp nhận">
        <Alert variant="destructive">
          <AlertDescription>Không tìm thấy phiếu tiếp nhận</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  const nextAction = getNextAction(workOrder)

  return (
    <DashboardLayout role="cv" title="Chi tiết phiếu tiếp nhận">
      <div className="space-y-6">
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
    </DashboardLayout>
  )
}
