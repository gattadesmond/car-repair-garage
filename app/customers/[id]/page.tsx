"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Car, Calendar, History, Wrench, FileText, Clock, CheckCircle, Phone, Mail, MapPin, MessageSquare } from "lucide-react"
import Link from "next/link"
import RoleLayout from "@/components/role-layout"
import { getCustomers, getWorkOrders, type Customer, type WorkOrder, type Car as CarType } from "@/lib/demo-data"
import { carBrands } from "@/lib/car-data"

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCar, setSelectedCar] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomer()
  }, [params.id])

  useEffect(() => {
    if (customer) {
      fetchWorkOrders()
    }
  }, [customer])

  const fetchCustomer = () => {
    setLoading(true)
    const customers = getCustomers()
    const foundCustomer = customers.find((c) => c.id === params.id)
    setCustomer(foundCustomer || null)
    
    if (!foundCustomer) {
      setLoading(false)
    }
  }

  const fetchWorkOrders = () => {
    if (!customer) return
    
    const allWorkOrders = getWorkOrders()
    const customerWorkOrders = allWorkOrders.filter((wo) => wo.customer_id === customer.id)
    
    // Sắp xếp theo thời gian tạo, mới nhất lên đầu
    customerWorkOrders.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    
    setWorkOrders(customerWorkOrders)
    setLoading(false)
  }

  // Lấy tên hãng xe từ ID
  const getBrandNameById = (brandId: string): string => {
    const brand = carBrands.find((b) => b.id === brandId)
    return brand?.name || brandId
  }

  // Lấy tên model từ ID
  const getModelNameById = (brandId: string, modelId: string): string => {
    const brand = carBrands.find((b) => b.id === brandId)
    const model = brand?.models.find((m) => m.id === modelId)
    return model?.name || modelId
  }

  // Lấy badge cho trạng thái đơn hàng
  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Đang chờ", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      diagnosis: { label: "Đang chuẩn đoán", variant: "outline" as const, color: "bg-blue-100 text-blue-800" },
      completed: { label: "Hoàn thành", variant: "default" as const, color: "bg-green-100 text-green-800" },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const, color: "bg-gray-100 text-gray-800" }
  }

  // Lấy badge cho loại dịch vụ
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

  // Lọc đơn hàng theo xe
  const filteredWorkOrders = selectedCar 
    ? workOrders.filter(wo => wo.car_id === selectedCar)
    : workOrders

  // Xác định role từ URL hoặc sử dụng role của người dùng hiện tại
  const getUserRole = () => {
    // Kiểm tra URL để xác định role
    const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
    if (pathname.includes('/admin/')) {
      return 'admin'
    } else {
      return 'cv' // Mặc định là cố vấn
    }
  }

  const userRole = getUserRole()

  if (loading) {
    return (
      <RoleLayout role={['admin', 'cv']} title="Chi tiết khách hàng">
        <div className="text-center py-8">Đang tải...</div>
      </RoleLayout>
    )
  }

  if (!customer) {
    return (
      <RoleLayout role={['admin', 'cv']} title="Chi tiết khách hàng">
        <Alert variant="destructive">
          <AlertDescription>Không tìm thấy thông tin khách hàng</AlertDescription>
        </Alert>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout role={['admin', 'cv']} title="Chi tiết khách hàng">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Link href={`/intake-form?customer=${customer.id}`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              Tạo phiếu mới
            </Button>
          </Link>
        </div>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Thông tin khách hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{customer.name}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-1.5 text-blue-500" />
                    {customer.phone}
                  </span>
                  {customer.email && (
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-1.5 text-blue-500" />
                      {customer.email}
                    </span>
                  )}
                </div>
                {customer.address && (
                  <p className="text-sm text-gray-600 mt-1 flex items-start">
                    <MapPin className="h-4 w-4 mr-1.5 text-blue-500 mt-0.5" />
                    {customer.address}
                  </p>
                )}
              </div>

              {customer.last_service && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <History className="h-4 w-4 text-blue-500" />
                  <span>Lần sửa cuối: {new Date(customer.last_service).toLocaleDateString("vi-VN")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cars */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>Danh sách xe</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                <Button 
                  variant={selectedCar === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCar(null)}
                  className="min-w-[80px] justify-center"
                >
                  Tất cả xe
                </Button>
                {customer.cars.map((car) => (
                  <Button
                    key={car.id}
                    variant={selectedCar === car.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCar(car.id)}
                    className="min-w-[80px] justify-center"
                  >
                    {car.license_plate}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {customer.cars.map((car) => (
                  <Card key={car.id} className={selectedCar && selectedCar !== car.id ? "opacity-60" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-blue-700">{car.license_plate}</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className="w-20 font-medium">Hãng xe:</span> 
                          <span className="flex-1">{getBrandNameById(car.brand)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-20 font-medium">Model:</span> 
                          <span className="flex-1">{getModelNameById(car.brand, car.model)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-20 font-medium">Năm SX:</span> 
                          <span className="flex-1">{car.year}</span>
                        </div>
                        {car.color && (
                          <div className="flex items-center">
                            <span className="w-20 font-medium">Màu:</span> 
                            <span className="flex-1">{car.color}</span>
                          </div>
                        )}
                        {car.vin_number && (
                          <div className="flex items-center">
                            <span className="w-20 font-medium">Số khung:</span> 
                            <span className="flex-1 break-all">{car.vin_number}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repair History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Lịch sửa chữa</span>
            </CardTitle>
            <CardDescription>
              {filteredWorkOrders.length} phiếu sửa chữa
              {selectedCar && " cho xe " + customer.cars.find(c => c.id === selectedCar)?.license_plate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWorkOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {selectedCar 
                  ? "Chưa có lịch sửa chữa cho xe này" 
                  : "Khách hàng chưa có lịch sửa chữa"}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWorkOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                              {new Date(order.received_date).toLocaleDateString("vi-VN")}
                            </span>
                            <span className="flex items-center">
                              <User className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                              Tiếp nhận: {order.received_by}
                            </span>
                          </div>
                        </div>
                        <Link href={`/work-orders/${order.id}`} className="self-start sm:self-center">
                          <Button size="sm" variant="outline" className="whitespace-nowrap">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>

                      <div className="space-y-2">
                          <div>
                            <h4 className="text-sm font-medium flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1.5 text-blue-500" />
                              Yêu cầu của khách hàng:
                            </h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">{order.customer_request}</p>
                          </div>

                          {order.repair_tasks && order.repair_tasks.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <Wrench className="h-4 w-4 mr-1.5 text-blue-500" />
                                Công việc sửa chữa:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {order.repair_tasks.map((task) => (
                                  <div key={task.id} className="bg-gray-50 p-2 rounded text-sm">
                                    <div className="flex items-center space-x-2">
                                      <Badge className={`${getServiceTypeBadge(task.service_type).color} whitespace-nowrap`}>
                                        {getServiceTypeBadge(task.service_type).label}
                                      </Badge>
                                      <span className="font-medium">{task.name}</span>
                                      {task.status === "completed" && (
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}