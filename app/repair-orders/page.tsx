"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Car, User, FileText, Calendar, Wrench, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { getWorkOrders, getCurrentUser, saveWorkOrders, type WorkOrder } from "@/lib/demo-data"

export default function RepairOrdersPage() {
  const router = useRouter()
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    
    // Kiểm tra vai trò người dùng, nếu không phải KTV thì chuyển hướng về trang chính
    if (!user || user.role !== "ktv") {
      router.push("/")
      return
    }
    
    fetchData()
  }, [filter, router])

  const fetchData = () => {
    const user = getCurrentUser()
    setCurrentUser(user)

    const orders = getWorkOrders()

    // Lọc theo vai trò người dùng và trạng thái
    let filteredOrders = orders
    
    // Nếu người dùng là KTV, chỉ hiển thị các công việc được gán cho KTV đó
    if (user?.role === "ktv") {
      filteredOrders = orders.filter((o) => o.assigned_technician === user.id)
    }
    
    // Lọc các lệnh sửa chữa (đã qua chẩn đoán và báo giá)
    if (filter === "diagnosis") {
      filteredOrders = filteredOrders.filter((o) => o.status === "diagnosis")
    } else if (filter === "completed") {
      filteredOrders = filteredOrders.filter((o) => o.status === "completed")
    } else {
      // Mặc định hiển thị cả diagnosis và completed
      filteredOrders = filteredOrders.filter((o) => 
        o.status === "diagnosis" || o.status === "completed")
    }

    // Sắp xếp theo thời gian cập nhật, mới nhất lên đầu
    filteredOrders.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

    setWorkOrders(filteredOrders)
    setLoading(false)
  }
  
  // Hàm tạo mẫu lệnh sửa chữa cho KTV hiện tại
  const createSampleRepairOrder = () => {
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const user = getCurrentUser()
      if (!user || user.role !== "ktv") {
        setError("Bạn không có quyền tạo lệnh sửa chữa mẫu")
        setLoading(false)
        return
      }
      
      const orders = getWorkOrders()
      
      // Tạo ID mới cho lệnh sửa chữa
      const newId = `work-order-${Date.now()}`
      
      // Tạo lệnh sửa chữa mẫu
      const sampleOrder: WorkOrder = {
        id: newId,
        customer_id: "customer-1",
        car_id: "car-1",
        customer_name: "Nguyễn Văn An",
        car_info: "Toyota Camry (2020)",
        license_plate: "51A-96695",
        customer_request: "Thay nhớt động cơ, thay lọc gió, kiểm tra phanh",
        initial_condition: ["Xe hoạt động bình thường", "Đèn check engine sáng"],
        diagnosis_symptoms: ["Tiếng ồn bất thường từ động cơ", "Phanh kêu khi sử dụng"],
        notes: "Khách hàng yêu cầu sử dụng nhớt chính hãng",
        received_by: "",
        received_date: new Date().toISOString().split("T")[0],
        status: "diagnosis",
        assigned_technician: user.id,
        estimated_completion: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Hoàn thành trong 1 ngày
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      // Thêm lệnh sửa chữa mẫu vào danh sách
      orders.push(sampleOrder)
      saveWorkOrders(orders)
      
      setSuccess("Đã tạo lệnh sửa chữa mẫu thành công!")
      fetchData() // Làm mới dữ liệu
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi tạo lệnh sửa chữa mẫu")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Đang chờ", variant: "secondary" as const },
      diagnosis: { label: "Đang chuẩn đoán", variant: "outline" as const },
      completed: { label: "Hoàn thành", variant: "success" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lệnh sửa chữa</h1>
          <div className="flex items-center space-x-2">
            <Button onClick={createSampleRepairOrder} className="mr-2" variant="outline">
              <Wrench className="mr-2 h-4 w-4" />
              Tạo lệnh sửa chữa mẫu
            </Button>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lệnh sửa chữa</SelectItem>
                <SelectItem value="diagnosis">Đang kiểm tra</SelectItem>
                <SelectItem value="completed">Đã hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="default" className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : workOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">Không có lệnh sửa chữa nào</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Hiện tại không có lệnh sửa chữa nào được gán cho bạn hoặc phù hợp với bộ lọc đã chọn.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {workOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusBadge(order.status).variant as any}>
                              {getStatusBadge(order.status).label}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              #{order.id.slice(-6)}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold mt-2">{order.car_info}</h3>
                          <p className="text-sm text-gray-500">{order.license_plate}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(order.updated_at).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-start space-x-2">
                            <User className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Khách hàng</p>
                              <p className="text-sm">{order.customer_name}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-start space-x-2">
                            <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Yêu cầu khách hàng</p>
                              <p className="text-sm line-clamp-2">{order.customer_request}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Link href={`/work-orders/${order.id}`}>
                          <Button>
                            <Wrench className="mr-2 h-4 w-4" />
                            {order.status === "completed" ? "Xem chi tiết" : "Cập nhật tiến độ"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}