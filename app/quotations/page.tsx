"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, FileText, Eye, Download } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { getWorkOrders, type WorkOrder } from "@/lib/demo-data"

export default function QuotationsPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuotations()
  }, [])

  const fetchQuotations = () => {
    const orders = getWorkOrders()
    // Filter orders that need quotation or already have quotation
    const quotationOrders = orders.filter((order) => order.status === "quotation" || order.status === "approved")
    setWorkOrders(quotationOrders)
    setLoading(false)
  }

  const filteredOrders = workOrders.filter(
    (order) =>
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.car_info.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const statusMap = {
      quotation: { label: "Chờ báo giá", variant: "secondary" as const },
      approved: { label: "Đã duyệt", variant: "default" as const },
      diagnosis: { label: "Đang kiểm tra", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  return (
    <DashboardLayout role="cv" title="Quản lý báo giá">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên khách hàng, biển số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo báo giá mới
          </Button>
        </div>

        {/* Quotations List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách báo giá</CardTitle>
            <CardDescription>Quản lý các báo giá sửa chữa</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Chưa có báo giá nào</div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{order.customer_name}</h4>
                          <Badge {...getStatusBadge(order.status)}>{getStatusBadge(order.status).label}</Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {order.license_plate} - {order.car_info}
                        </p>

                        <p className="text-sm mb-2">
                          <span className="font-medium">Yêu cầu:</span> {order.customer_request}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Tiếp nhận: {new Date(order.received_date).toLocaleDateString("vi-VN")}</span>
                          {order.estimated_completion && (
                            <span>Dự kiến: {new Date(order.estimated_completion).toLocaleDateString("vi-VN")}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Link href={`/quotations/${order.id}`}>
                          <Button size="sm" variant="outline" className="w-full">
                            <Eye className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        {order.status === "quotation" && (
                          <Link href={`/quotations/${order.id}/edit`}>
                            <Button size="sm" className="w-full">
                              <FileText className="h-4 w-4 mr-1" />
                              Lập báo giá
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
