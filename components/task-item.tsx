"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, Wrench, User } from "lucide-react"
import Link from "next/link"

export interface TaskItemProps {
  task: {
    id: string
    name: string
    description?: string
    status?: "pending" | "in_progress" | "completed" | string
    service_type: "cleaning" | "painting" | "mechanical" | "electrical" | "ac" | string
    created_at: string
    estimated_completion?: string
    assigned_technician?: string
    notes?: string
    work_order_id?: string
  }
  car_info?: string
  license_plate?: string
  customer_name?: string
  technician?: {
    id: string
    name: string
    full_name?: string
  } | null
  detailsUrl?: string
  onActionClick?: () => void
  actionLabel?: string
  showNotes?: boolean
  actionElement?: React.ReactNode
}

export default function TaskItem({
  task,
  car_info,
  license_plate,
  customer_name,
  technician,
  detailsUrl,
  onActionClick,
  actionLabel = "Xem chi tiết",
  showNotes = false,
  actionElement
}: TaskItemProps) {
  // Lấy thông tin xe và khách hàng từ task nếu không được truyền vào
  const carInfo = car_info || task.car_info
  const licensePlate = license_plate || task.license_plate
  const customerName = customer_name || task.customer_name

  // Hàm lấy badge style dựa trên trạng thái
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

  // Hàm lấy badge style dựa trên loại dịch vụ
  const getServiceTypeBadge = (type: string) => {
    switch (type) {
      case "cleaning":
        return { label: "Dọn Dẹp", color: "bg-blue-100 text-blue-800" }
      case "painting":
        return { label: "Đồng Sơn", color: "bg-orange-100 text-orange-800" }
      case "mechanical":
        return { label: "Cơ", color: "bg-green-100 text-green-800" }
      case "electrical":
        return { label: "Điện", color: "bg-purple-100 text-purple-800" }
      case "ac":
      case "cooling":
        return { label: "Lạnh", color: "bg-cyan-100 text-cyan-800" }
      default:
        return { label: "Khác", color: "bg-gray-100 text-gray-800" }
    }
  }

  // Lấy icon dựa trên loại dịch vụ
  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "cleaning":
        return <Wrench className="h-5 w-5 text-blue-600" />
      case "painting":
        return <Wrench className="h-5 w-5 text-orange-600" />
      case "mechanical":
        return <Wrench className="h-5 w-5 text-green-600" />
      case "electrical":
        return <Wrench className="h-5 w-5 text-purple-600" />
      case "ac":
      case "cooling":
        return <Wrench className="h-5 w-5 text-cyan-600" />
      default:
        return <Wrench className="h-5 w-5 text-gray-600" />
    }
  }

  const statusBadge = getStatusBadge(task.status || "pending")
  const serviceTypeBadge = getServiceTypeBadge(task.service_type)

  return (
    <Card className="border shadow-sm hover:shadow transition-all">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-shrink-0">
                {getServiceTypeIcon(task.service_type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Badge className={serviceTypeBadge.color}>
                    {serviceTypeBadge.label}
                  </Badge>
                  <h4 className="font-medium">{task.name}</h4>
                  <Badge className={statusBadge.color}>
                    {statusBadge.label}
                  </Badge>
                </div>
              </div>
            </div>
            
            {(carInfo || licensePlate || customerName) && (
              <p className="text-sm text-gray-600 mb-1">
                {licensePlate && <span>{licensePlate}</span>}
                {carInfo && <span> - {carInfo}</span>}
                {customerName && <span> | Khách hàng: {customerName}</span>}
              </p>
            )}
            
            {task.description && (
              <p className="text-sm text-gray-600 mb-2">
                {task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description}
              </p>
            )}
            
            {showNotes && task.notes && (
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700">Ghi chú của KTV:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                  {task.notes}
                </p>
              </div>
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
              {technician && (
                <span className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  KTV: {technician.full_name || technician.name}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {actionElement ? (
              actionElement
            ) : onActionClick ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onActionClick}
                className="shadow-sm"
              >
                {actionLabel}
              </Button>
            ) : detailsUrl ? (
              <Link href={detailsUrl}>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="shadow-sm"
                >
                  {actionLabel}
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}