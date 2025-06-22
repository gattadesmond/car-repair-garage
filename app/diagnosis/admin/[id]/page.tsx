"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, User, Car, Calendar, History, Wrench, FileText, Clock, CheckCircle, Edit, Phone, Mail, MapPin, AlertCircle, Tool, Zap, Droplets, Paintbrush, Thermometer } from "lucide-react"
import Link from "next/link"
import RoleLayout from "@/components/role-layout"
import { getCustomers, getWorkOrders, type Customer, type WorkOrder, type Car as CarType, getCurrentUser } from "@/lib/demo-data"
import { carBrands } from "@/lib/car-data"

export default function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCar, setSelectedCar] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.role !== "admin") {
      router.push(`/${currentUser.role}/dashboard`)
      return
    }

    setUser(currentUser)
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
  if (loading) {
    return (
      <RoleLayout role="admin" title="Chi tiết khách hàng">
        <div className="text-center py-8">Đang tải...</div>
      </RoleLayout>
    )
  }

  if (!customer) {
    return (
      <RoleLayout role="admin" title="Chi tiết khách hàng">
        <Alert variant="destructive">
          <AlertDescription>Không tìm thấy thông tin khách hàng</AlertDescription>
        </Alert>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout role="admin" title="Chi tiết khách hàng">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex gap-2">
            <Link href={`/admin/customers/edit/${customer.id}`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            </Link>
            <Link href={`/intake-form/admin?customer=${customer.id}`}>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Tạo phiếu mới
              </Button>
            </Link>
          </div>
        </div>

        {/* Customer Info */}
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Thông tin khách hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-4">{customer.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center space-x-3 text-sm bg-gray-50 p-3 rounded-md">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">SĐT:</span>
                    <span className="flex-grow">{customer.phone}</span>
                  </div>
                  
                  {customer.email && (
                    <div className="flex items-center space-x-3 text-sm bg-gray-50 p-3 rounded-md">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Email:</span>
                      <span className="flex-grow">{customer.email}</span>
                    </div>
                  )}
                  
                  {customer.address && (
                    <div className="flex items-start space-x-3 text-sm col-span-1 md:col-span-2 bg-gray-50 p-3 rounded-md">
                      <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="font-medium mt-0.5">Địa chỉ:</span>
                      <span>{customer.address}</span>
                    </div>
                  )}
                  
                  {customer.last_service && (
                    <div className="flex items-center space-x-3 text-sm bg-gray-50 p-3 rounded-md">
                      <History className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Lần sửa cuối:</span>
                      <span>{new Date(customer.last_service).toLocaleDateString("vi-VN")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cars */}
        <Card className="border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>Danh sách xe</span>
            </CardTitle>
            <CardDescription>
              {customer.cars.length} xe đã đăng ký
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 mb-6 bg-gray-50 p-3 rounded-md">
                <Button 
                  variant={selectedCar === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCar(null)}
                  className="shadow-sm"
                >
                  Tất cả xe
                </Button>
                {customer.cars.map((car) => (
                  <Button
                    key={car.id}
                    variant={selectedCar === car.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCar(car.id)}
                    className="shadow-sm"
                  >
                    {car.license_plate}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customer.cars.map((car) => (
                  <Card key={car.id} className={`border-l-4 ${selectedCar && selectedCar !== car.id ? "opacity-60 border-gray-300" : "border-green-500"} hover:shadow-md transition-all duration-200`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Car className="h-4 w-4 text-green-500" />
                          {car.license_plate}
                        </h3>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium w-24 text-gray-600">Hãng xe:</span> 
                          <span className="font-semibold">{getBrandNameById(car.brand)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24 text-gray-600">Model:</span> 
                          <span className="font-semibold">{getModelNameById(car.brand, car.model)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24 text-gray-600">Năm SX:</span> 
                          <span>{car.year}</span>
                        </div>
                        {car.color && (
                          <div className="flex items-center">
                            <span className="font-medium w-24 text-gray-600">Màu:</span> 
                            <span>{car.color}</span>
                          </div>
                        )}
                        {car.vin_number && (
                          <div className="flex items-center">
                            <span className="font-medium w-24 text-gray-600">Số khung:</span> 
                            <span className="font-mono text-xs bg-gray-100 p-1 rounded">{car.vin_number}</span>
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
        <Card className="border-l-4 border-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Lịch sử sửa chữa</span>
            </CardTitle>
            <CardDescription>
              {filteredWorkOrders.length} phiếu sửa chữa
              {selectedCar && " cho xe " + customer.cars.find(c => c.id === selectedCar)?.license_plate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWorkOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md flex flex-col items-center">
                <AlertCircle className="h-10 w-10 mx-auto mb-2 text-amber-500" />
                {selectedCar 
                  ? "Chưa có lịch sử sửa chữa cho xe này" 
                  : "Khách hàng chưa có lịch sử sửa chữa"}
              </div>
            ) : (
              <div className="space-y-6">
                {/* OrderItem Component - Theo mô tả trong order-item.md */}
                {filteredWorkOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden border-l-4 border-amber-500 hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      {/* Header của OrderItem */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center flex-wrap gap-2">
                            <h3 className="font-semibold flex items-center gap-2">
                              <Car className="h-4 w-4 text-blue-500" />
                              {order.car_info} - {order.license_plate}
                            </h3>
                            <Badge className={getStatusBadge(order.status).color + " flex items-center gap-1"}>
                              {order.status === "completed" && <CheckCircle className="h-3 w-3" />}
                              {order.status === "diagnosis" && <Clock className="h-3 w-3" />}
                              {order.status === "pending" && <Clock className="h-3 w-3" />}
                              {getStatusBadge(order.status).label}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                              {new Date(order.received_date).toLocaleDateString("vi-VN")}
                            </span>
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1 text-blue-500" />
                              Tiếp nhận: {order.received_by || "Chưa có"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {/* Hiển thị nút thao tác dựa vào trạng thái */}
                          {order.status === "pending" && (
                            <Link href={`/diagnosis/admin/${order.id}`}>
                              <Button size="sm" variant="outline" className="shadow-sm">
                                <Wrench className="h-3 w-3 mr-1" />
                                Chuẩn đoán
                              </Button>
                            </Link>
                          )}
                          <Link href={`/work-orders/${order.id}`}>
                            <Button size="sm" variant={order.status === "pending" ? "outline" : "default"} className="shadow-sm">
                              {order.status === "completed" ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Xem chi tiết
                                </>
                              ) : (
                                <>Xem chi tiết</>
                              )}
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Nội dung của OrderItem */}
                      <div className="space-y-4 mt-4">
                        {/* Yêu cầu của khách hàng */}
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                            Yêu cầu của khách hàng:
                          </h4>
                          <p className="text-sm text-gray-600 pl-5">{order.customer_request}</p>
                        </div>

                        {/* Danh sách TaskItem */}
                        {order.repair_tasks && order.repair_tasks.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                              <Wrench className="h-3 w-3 text-blue-500" />
                              Công việc sửa chữa:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                              {/* TaskItem Component - Theo mô tả trong task-item.md */}
                              {order.repair_tasks.map((task) => {
                                // Chọn icon phù hợp với loại dịch vụ
                                let ServiceIcon = Wrench;
                                switch(task.service_type) {
                                  case "mechanical":
                                    ServiceIcon = Tool;
                                    break;
                                  case "electrical":
                                    ServiceIcon = Zap;
                                    break;
                                  case "cleaning":
                                    ServiceIcon = Droplets;
                                    break;
                                  case "painting":
                                    ServiceIcon = Paintbrush;
                                    break;
                                  case "ac":
                                    ServiceIcon = Thermometer;
                                    break;
                                }
                                
                                return (
                                  <div key={task.id} className="bg-gray-50 p-3 rounded-md border border-gray-100 shadow-sm hover:border-blue-200 transition-all duration-200">
                                    {/* Header của TaskItem */}
                                    <div className="flex items-center gap-2 mb-2">
                                      <ServiceIcon className="h-4 w-4 text-gray-500" />
                                      <Badge className={getServiceTypeBadge(task.service_type).color}>
                                        {getServiceTypeBadge(task.service_type).label}
                                      </Badge>
                                      <span className="font-medium flex-grow">{task.name}</span>
                                      {/* Trạng thái của TaskItem */}
                                      {task.status === "completed" ? (
                                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                          <CheckCircle className="h-3 w-3" />
                                          Hoàn thành
                                        </Badge>
                                      ) : task.status === "in_progress" ? (
                                        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          Đang thực hiện
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          Đang chờ
                                        </Badge>
                                      )}
                                    </div>
                                    {/* Thông tin KTV phụ trách */}
                                    {task.assigned_technician && (
                                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-2 bg-gray-100 p-1.5 rounded">
                                        <User className="h-3 w-3" />
                                        KTV: {task.assigned_technician}
                                      </div>
                                    )}
                                    {/* Mô tả công việc */}
                                    {task.description && (
                                      <div className="text-xs text-gray-600 mt-2 border-t pt-2">{task.description}</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
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