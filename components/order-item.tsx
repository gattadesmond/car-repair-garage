"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckSquare, Calendar, User, FileText } from "lucide-react"
import Link from "next/link"

interface OrderItemProps {
  order: {
    id: string
    customer_name: string
    car_info: string
    license_plate?: string
    status: "pending" | "diagnosis" | "completed" | string
    creation_date?: string
    created_at?: string
    request?: string
    customer_request?: string
    technician_id?: string
  }
  technician?: {
    id: string
    name: string
  } | null
  detailsUrl: string
}

export default function OrderItem({ order, technician, detailsUrl }: OrderItemProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Đang chờ", color: "bg-yellow-100 text-yellow-800" }
      case "diagnosis":
        return { label: "Đang chuẩn đoán", color: "bg-blue-100 text-blue-800" }
      case "completed":
        return { label: "Hoàn thành", color: "bg-green-100 text-green-800" }
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" }
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="border-l-4 border-blue-500 pl-4 py-4 pr-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-blue-800">
                {order.car_info} - {order.license_plate}
              </h3>
              <Badge className={getStatusBadge(order.status).color}>
                {getStatusBadge(order.status).label}
              </Badge>
            </div>
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                {new Date(order.created_at || order.creation_date || "").toLocaleDateString("vi-VN")}
              </span>
              <span className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                {order.customer_name}
              </span>
            </div>
          </div>
          <Link href={detailsUrl} className="self-start sm:self-center">
            <Button size="sm" variant="outline" className="whitespace-nowrap">
              Chi tiết
            </Button>
          </Link>
        </div>
        <div>
          <h4 className="text-sm font-medium flex items-center">
            <FileText className="h-4 w-4 mr-1.5 text-blue-500" />
            Yêu cầu của khách hàng:
          </h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md mt-1">{order.request || order.customer_request}</p>
        </div>
      </div>
    </Card>
  )
}