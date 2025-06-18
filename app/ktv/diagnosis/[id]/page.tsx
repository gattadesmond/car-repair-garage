"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Wrench, Settings, Save } from "lucide-react"
import RoleLayout from "@/components/role-layout"
import { getWorkOrders, getTechnicians, getCurrentUser, saveWorkOrders, type WorkOrder } from "@/lib/demo-data"

interface DiagnosisData {
  technicianNotes: string
  repairNotes: string
  priority: string
  specialInstructions: string
  estimatedCompletion: string
  repairItems: { item: string; requirement: string }[]
}

export default function DiagnosisPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [technicians, setTechnicians] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData>({
    technicianNotes: "",
    repairNotes: "",
    priority: "normal",
    specialInstructions: "",
    estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    repairItems: [{ item: "", requirement: "" }]
  })

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "ktv") {
      router.push("/login")
      return
    }
    setCurrentUser(user)

    const fetchData = async () => {
      try {
        const orders = getWorkOrders()
        const order = orders.find((o) => o.id === id)
        if (!order) {
          setError("Không tìm thấy phiếu sửa chữa")
          setLoading(false)
          return
        }
        setWorkOrder(order)
        
        // Tải danh sách kỹ thuật viên
        const techs = getTechnicians()
        setTechnicians(techs)
        
        // Tải dữ liệu chẩn đoán nếu đã có
        const savedDiagnosis = localStorage.getItem(`diagnosis_${id}`)
        if (savedDiagnosis) {
          setDiagnosisData(JSON.parse(savedDiagnosis))
        }
        
        setLoading(false)
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu")
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id, router])

  const handleAcceptTask = () => {
    if (!workOrder || !currentUser) return
    
    try {
      const orders = getWorkOrders()
      const updatedOrders = orders.map((order) => {
        if (order.id === id) {
          return {
            ...order,
            status: "diagnosis",
            assigned_to: currentUser.id,
            assigned_name: currentUser.name,
            updated_at: new Date().toISOString()
          }
        }
        return order
      })
      
      saveWorkOrders(updatedOrders)
      setWorkOrder({
        ...workOrder,
        status: "diagnosis",
        assigned_to: currentUser.id,
        assigned_name: currentUser.name,
        updated_at: new Date().toISOString()
      })
      
      setSuccess("Đã nhận công việc thành công")
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError("Đã xảy ra lỗi khi cập nhật trạng thái")
    }
  }

  const handleSubmitDiagnosis = (e: React.FormEvent) => {
    e.preventDefault()
    if (!workOrder) return
    
    setSaving(true)
    setError(null)
    
    try {
      // Lưu dữ liệu chẩn đoán vào localStorage
      localStorage.setItem(`diagnosis_${id}`, JSON.stringify(diagnosisData))
      
      // Cập nhật trạng thái đơn hàng
      const orders = getWorkOrders()
      const updatedOrders = orders.map((order) => {
        if (order.id === id) {
          return {
            ...order,
            status: "in_inspection",
            updated_at: new Date().toISOString(),
            diagnosis_completed_at: new Date().toISOString(),
            priority: diagnosisData.priority,
            estimated_completion: diagnosisData.estimatedCompletion
          }
        }
        return order
      })
      
      saveWorkOrders(updatedOrders)
      
      setSuccess("Đã lưu thông tin chẩn đoán thành công")
      
      // Chuyển hướng đến trang chi tiết đơn hàng sau 2 giây
      setTimeout(() => {
        router.push(`/ktv/work-orders/${id}`)
      }, 2000)
    } catch (err) {
      setError("Đã xảy ra lỗi khi lưu thông tin chẩn đoán")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <RoleLayout role="ktv" title="Chẩn đoán kỹ thuật">
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </RoleLayout>
    )
  }

  if (!workOrder) {
    return (
      <RoleLayout role="ktv" title="Chẩn đoán kỹ thuật">
        <div className="container mx-auto py-6">
          <Alert variant="destructive">
            <AlertDescription>Không tìm thấy phiếu sửa chữa</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => router.back()}>Quay lại</Button>
        </div>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout role="ktv" title="Chẩn đoán kỹ thuật">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chẩn đoán kỹ thuật</h1>
            <p className="text-gray-500">Mã phiếu: {workOrder.id}</p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>Quay lại</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin phiếu sửa chữa</CardTitle>
            <CardDescription>Chi tiết về khách hàng và xe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Thông tin khách hàng</h3>
                <p className="text-sm text-gray-500 mt-1">{workOrder.customer_name}</p>
                <p className="text-sm text-gray-500">{workOrder.customer_phone}</p>
              </div>
              <div>
                <h3 className="font-medium">Thông tin xe</h3>
                <p className="text-sm text-gray-500 mt-1">{workOrder.car_make} {workOrder.car_model}</p>
                <p className="text-sm text-gray-500">Biển số: {workOrder.license_plate}</p>
              </div>
              <div>
                <h3 className="font-medium">Ngày tiếp nhận</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(workOrder.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Kỹ thuật viên</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {workOrder.assigned_name || "Chưa phân công"}
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-medium">Yêu cầu của khách hàng</h3>
              <p className="text-sm text-gray-500 mt-1">{workOrder.customer_request || "Không có yêu cầu cụ thể"}</p>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium">Tình trạng ban đầu</h3>
              <p className="text-sm text-gray-500 mt-1">{workOrder.initial_condition || "Không có ghi chú"}</p>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium">Ghi chú</h3>
              <p className="text-sm text-gray-500 mt-1">{workOrder.notes || "Không có ghi chú"}</p>
            </div>
          </CardContent>
        </Card>

        {workOrder.status === "pending" && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <p className="text-center">Bạn cần nhận công việc này để bắt đầu chẩn đoán</p>
                <Button onClick={handleAcceptTask}>Nhận công việc</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {(workOrder.status === "diagnosis" || workOrder.status === "in_inspection") && (
          <form onSubmit={handleSubmitDiagnosis} className="space-y-6">
            {/* Technician Notes - Ghi chú kỹ thuật viên */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Ghi chú kỹ thuật viên</span>
                </CardTitle>
                <CardDescription>Nhập các ghi chú về tình trạng xe và chẩn đoán ban đầu</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="technicianNotes"
                  placeholder="Nhập ghi chú về tình trạng xe, các vấn đề phát hiện..."
                  value={diagnosisData.technicianNotes}
                  onChange={(e) => setDiagnosisData((prev) => ({ ...prev, technicianNotes: e.target.value }))}
                  className="mt-2"
                  rows={6}
                />
              </CardContent>
            </Card>
            
            {/* Repair Items - Hạng mục sửa chữa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <span>Hạng mục sửa chữa</span>
                </CardTitle>
                <CardDescription>Thêm các hạng mục cần sửa chữa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="bg-gray-50 p-3 border-b">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="font-medium text-sm">Hạng mục</div>
                      <div className="font-medium text-sm">Yêu cầu</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {diagnosisData.repairItems.map((item, index) => (
                      <div key={index} className="p-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Input
                              placeholder="Tên hạng mục"
                              value={item.item}
                              onChange={(e) => {
                                const newItems = [...diagnosisData.repairItems];
                                newItems[index].item = e.target.value;
                                setDiagnosisData(prev => ({ ...prev, repairItems: newItems }));
                              }}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Yêu cầu cụ thể"
                              value={item.requirement}
                              onChange={(e) => {
                                const newItems = [...diagnosisData.repairItems];
                                newItems[index].requirement = e.target.value;
                                setDiagnosisData(prev => ({ ...prev, repairItems: newItems }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="p-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setDiagnosisData(prev => ({
                            ...prev,
                            repairItems: [...prev.repairItems, { item: "", requirement: "" }]
                          }));
                        }}
                        type="button"
                      >
                        + Thêm hạng mục
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Repair Notes - Ghi chú sửa chữa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <span>Ghi chú sửa chữa</span>
                </CardTitle>
                <CardDescription>Nhập các hạng mục sửa chữa và ghi chú chi tiết</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="repairNotes"
                  placeholder="Nhập các hạng mục cần sửa chữa, thay thế phụ tùng, vật tư..."
                  value={diagnosisData.repairNotes}
                  onChange={(e) => setDiagnosisData((prev) => ({ ...prev, repairNotes: e.target.value }))}
                  className="mt-2"
                  rows={6}
                />
              </CardContent>
            </Card>

            {/* Assignment and Estimates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Thông tin bổ sung</span>
                </CardTitle>
                <CardDescription>Thông tin về độ ưu tiên và thời gian dự kiến</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Độ ưu tiên</Label>
                    <Select
                      value={diagnosisData.priority}
                      onValueChange={(value) => setDiagnosisData((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Thấp</SelectItem>
                        <SelectItem value="normal">Bình thường</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                        <SelectItem value="urgent">Khẩn cấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="estimatedCompletion">Thời gian hoàn thành dự kiến</Label>
                    <Input
                      id="estimatedCompletion"
                      type="date"
                      value={diagnosisData.estimatedCompletion}
                      onChange={(e) => setDiagnosisData((prev) => ({ ...prev, estimatedCompletion: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialInstructions">Hướng dẫn đặc biệt</Label>
                  <Textarea
                    id="specialInstructions"
                    placeholder="Các lưu ý đặc biệt, yêu cầu kỹ thuật, thứ tự thực hiện..."
                    value={diagnosisData.specialInstructions}
                    onChange={(e) => setDiagnosisData((prev) => ({ ...prev, specialInstructions: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

            <div className="flex space-x-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  "Đang lưu..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Hoàn tất chẩn đoán & Chuyển cho cố vấn
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Quay lại
              </Button>
            </div>
          </form>
        )}
      </div>
    </RoleLayout>
  )
}