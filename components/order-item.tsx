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
  // Hàm lấy badge style dựa trên trạng thái
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Đang chờ
          </Badge>
        )
      case "diagnosis":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Đang chuẩn đoán
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckSquare className="h-3 w-3" /> Hoàn thành
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="border-amber-200 shadow-sm hover:shadow transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-base font-medium">{order.customer_name}</h3>
              {getStatusBadge(order.status)}
            </div>
            <div className="bg-gray-50 p-2 rounded-md mb-2">
              <div className="flex items-center gap-1.5">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-lg font-semibold">{order.car_info}</span>
                {order.license_plate && (
                  <span className="text-sm text-gray-500 ml-1">({order.license_plate})</span>
                )}
              </div>
              {(order.request || order.customer_request) && (
                <p className="text-sm text-gray-600 mt-1">
                  {order.request || order.customer_request}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>{new Date(order.created_at || order.creation_date || "").toLocaleDateString("vi-VN")}</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-blue-500" />
                <span>{technician ? technician.name : "Chưa phân công"}</span>
              </div> */}
            </div>
          </div>
          <Link href={detailsUrl}>
            <Button 
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 shadow-sm"
            >
              Chi tiết
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}