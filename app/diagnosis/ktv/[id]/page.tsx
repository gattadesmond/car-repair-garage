"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Car, User, FileText, Calendar, Save, AlertTriangle, Settings, CheckCircle, Wrench } from "lucide-react"
import RoleLayout from "@/components/role-layout"
import { getWorkOrders, saveWorkOrders, getTechnicians, getCurrentUser, type WorkOrder, type Technician } from "@/lib/demo-data"
import { addDays } from "date-fns"

interface DiagnosisData {
  technicianNotes: string;
  repairNotes: string;
  priority: string;
  specialInstructions: string;
  estimatedCompletion: Date;
  repairItems: Array<{
    item: string;
    requirement: string;
  }>;
}

export default function KTVDiagnosisPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)

  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData>({
    technicianNotes: "",
    repairNotes: "",
    priority: "medium",
    specialInstructions: "",
    estimatedCompletion: addDays(new Date(), 3),
    repairItems: [
      { item: "", requirement: "" },
      { item: "", requirement: "" },
      { item: "", requirement: "" },
      { item: "", requirement: "" },
      { item: "", requirement: "" },
      { item: "", requirement: "" },
      { item: "", requirement: "" },
    ]
  })

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    fetchWorkOrder()
    fetchTechnicians()
  }, [params.id])

  const fetchWorkOrder = () => {
    const workOrders = getWorkOrders()
    const order = workOrders.find((w) => w.id === params.id)

    if (order) {
      setWorkOrder(order)

      // Load existing diagnosis data if available
      const diagnosisKey = `diagnosis-${params.id}`
      const storedDiagnosis = localStorage.getItem(diagnosisKey)
      if (storedDiagnosis) {
        try {
          const parsedDiagnosis = JSON.parse(storedDiagnosis)
          setDiagnosisData(parsedDiagnosis)
        } catch (error) {
          console.error("Error parsing stored diagnosis:", error)
        }
      }

      // Nếu đã có kỹ thuật viên được gán từ form tiếp nhận, set làm mặc định
      if (order.assigned_technician) {
        setDiagnosisData((prev) => ({
          ...prev,
          assignedTechnician: order.assigned_technician || "",
        }))
      }
    } else {
      setError("Không tìm thấy phiếu tiếp nhận")
    }
    setLoading(false)
  }

  const fetchTechnicians = () => {
    const techs = getTechnicians()
    setTechnicians(techs)
  }

  const handleAcceptTask = () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      // Update work order status to diagnosis
      const workOrders = getWorkOrders()
      const orderIndex = workOrders.findIndex((w) => w.id === params.id)

      if (orderIndex !== -1) {
        // Kiểm tra xem KTV hiện tại có phải là KTV được phân công không
        const currentTechId = currentUser?.id
        if (workOrder?.assigned_technician && workOrder.assigned_technician !== currentTechId) {
          setError("Bạn không phải là KTV được phân công cho công việc này")
          setSaving(false)
          return
        }

        workOrders[orderIndex] = {
          ...workOrders[orderIndex],
          status: "diagnosis",
          assigned_technician: currentUser?.id || workOrder?.assigned_technician || "",
          updated_at: new Date().toISOString(),
        }
        saveWorkOrders(workOrders)
        setWorkOrder(workOrders[orderIndex])
        setSuccess("Đã nhận công việc thành công!")
      }
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi nhận công việc")
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      // Validate required fields
      if (!diagnosisData.technicianNotes) {
        setError("Vui lòng nhập ghi chú của kỹ thuật viên")
        setSaving(false)
        return
      }

      // Update work order with diagnosis info
      const workOrders = getWorkOrders()
      const orderIndex = workOrders.findIndex((w) => w.id === params.id)

      if (orderIndex !== -1) {
        workOrders[orderIndex] = {
          ...workOrders[orderIndex],
          status: "diagnosis",
          estimated_completion: diagnosisData.estimatedCompletion,
          updated_at: new Date().toISOString(),
        }
        saveWorkOrders(workOrders)

        // Save diagnosis data to localStorage for later use in repair process
        const diagnosisKey = `diagnosis-${params.id}`
        localStorage.setItem(diagnosisKey, JSON.stringify(diagnosisData))
        
        // Hiển thị thông báo thành công
        setSuccess("Đã lưu chẩn đoán thành công! Đang chuyển đến trang sửa chữa...")
        
        // Chuyển hướng đến trang sửa chữa sau 1.5 giây
        setTimeout(() => {
          router.push(`/work-orders/${params.id}`)
        }, 1500)
      } else {
        router.push("/dashboard/ktv")
      }
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi lưu chẩn đoán")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <RoleLayout role="ktv" title="Chẩn đoán & Kiểm tra xe">
        <div className="text-center py-8">Đang tải...</div>
      </RoleLayout>
    )
  }

  if (!workOrder) {
    return (
      <RoleLayout role="ktv" title="Chẩn đoán & Kiểm tra xe">
        <Alert variant="destructive">
          <AlertDescription>Không tìm thấy phiếu tiếp nhận</AlertDescription>
        </Alert>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout role="ktv" title="Chẩn đoán & Kiểm tra xe">
      <div className="space-y-6">
        {/* Work Order Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Thông tin phiếu tiếp nhận</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Khách hàng:</span>
                  <span>{workOrder.customer_name}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Car className="h-4 w-4" />
                  <span className="font-medium">Xe:</span>
                  <span>
                    {workOrder.car_info} - {workOrder.license_plate}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Ngày tiếp nhận:</span>
                  <span>{new Date(workOrder.received_date).toLocaleDateString("vi-VN")}</span>
                </div>
                {workOrder.assigned_technician && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">KTV được gán:</span>
                    <span>
                      {technicians.find((t) => t.id === workOrder.assigned_technician)?.full_name ||
                        workOrder.assigned_technician}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="mb-2">
                  <span className="font-medium">Yêu cầu khách hàng:</span>
                  <p className="text-sm text-gray-600 mt-1">{workOrder.customer_request}</p>
                </div>
                <div className="mb-2">
                  <span className="font-medium">Tình trạng ban đầu:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {workOrder.initial_condition.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {workOrder.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <span className="font-medium">Ghi chú:</span>
                <p className="text-sm mt-1">{workOrder.notes}</p>
              </div>
            )}

            {/* Hiển thị nút nhận task nếu trạng thái là pending */}
            {workOrder.status === "pending" && (
              <div className="mt-4">
                <Button onClick={handleAcceptTask} disabled={saving} className="w-full">
                  {saving ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Nhận công việc này
                    </>
                  )}
                </Button>
              </div>
            )}

            {success && (
              <Alert className="mt-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Diagnosis Form - Chỉ hiển thị nếu đã nhận task */}
        {workOrder.status === "diagnosis" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bảng hạng mục sửa chữa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <span>Hạng mục sửa chữa</span>
                </CardTitle>
                <CardDescription>Nhập các hạng mục cần sửa chữa và yêu cầu công việc</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <div className="md:block hidden"> {/* Phiên bản desktop/tablet */}
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left p-3 font-medium text-gray-700 w-1/2">HẠNG MỤC SỬA CHỮA</th>
                          <th className="text-left p-3 font-medium text-gray-700 w-1/2">YÊU CẦU CÔNG VIỆC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosisData.repairItems.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3">
                              <Input 
                                placeholder={index === 0 ? "Thay nhớt lọc" : 
                                  index === 1 ? "Thay dầu gội máy lạnh" :
                                  index === 2 ? "Cảo sơ cua T bên phải" :
                                  index === 3 ? "Cảo sơ cua T máy kéo" :
                                  index === 4 ? "Cảo sơ cua T chân máy" :
                                  index === 5 ? "Cảo sơ đơn xe (xịt)" :
                                  "Rô tuyn trái đứng lồng"}
                                value={item.item}
                                onChange={(e) => {
                                  const newItems = [...diagnosisData.repairItems];
                                  newItems[index].item = e.target.value;
                                  setDiagnosisData(prev => ({ ...prev, repairItems: newItems }));
                                }}
                              />
                            </td>
                            <td className="p-3">
                              <Input 
                                placeholder="Thay"
                                value={item.requirement}
                                onChange={(e) => {
                                  const newItems = [...diagnosisData.repairItems];
                                  newItems[index].requirement = e.target.value;
                                  setDiagnosisData(prev => ({ ...prev, repairItems: newItems }));
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="p-3" colSpan={2}>
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
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Phiên bản mobile */}
                  <div className="md:hidden block">
                    {diagnosisData.repairItems.map((item, index) => (
                      <div key={index} className="border-b p-3">
                        <div className="mb-2">
                          <Label className="text-xs font-medium text-gray-700 mb-1 block">HẠNG MỤC SỬA CHỮA</Label>
                          <Input 
                            placeholder={index === 0 ? "Thay nhớt lọc" : 
                              index === 1 ? "Thay dầu gội máy lạnh" :
                              index === 2 ? "Cảo sơ cua T bên phải" :
                              index === 3 ? "Cảo sơ cua T máy kéo" :
                              index === 4 ? "Cảo sơ cua T chân máy" :
                              index === 5 ? "Cảo sơ đơn xe (xịt)" :
                              "Rô tuyn trái đứng lồng"}
                            value={item.item}
                            onChange={(e) => {
                              const newItems = [...diagnosisData.repairItems];
                              newItems[index].item = e.target.value;
                              setDiagnosisData(prev => ({ ...prev, repairItems: newItems }));
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-700 mb-1 block">YÊU CẦU CÔNG VIỆC</Label>
                          <Input 
                            placeholder="Thay"
                            value={item.requirement}
                            onChange={(e) => {
                              const newItems = [...diagnosisData.repairItems];
                              newItems[index].requirement = e.target.value;
                              setDiagnosisData(prev => ({ ...prev, repairItems: newItems }));
                            }}
                          />
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