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
import { Car, User, FileText, Calendar, Save, AlertTriangle, Settings, Wrench, CheckCircle } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { getWorkOrders, saveWorkOrders, getTechnicians, type WorkOrder, type Technician } from "@/lib/demo-data"

export default function DiagnosisPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [diagnosisData, setDiagnosisData] = useState({
    technicianNotes: "",
    priority: "normal",
    specialInstructions: "",
    estimatedCompletion: "",
  })

  useEffect(() => {
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
          status: "quotation",
          estimated_completion: diagnosisData.estimatedCompletion,
          updated_at: new Date().toISOString(),
        }
        saveWorkOrders(workOrders)

        // Save diagnosis data to localStorage for later use in quotation
        const diagnosisKey = `diagnosis-${params.id}`
        localStorage.setItem(diagnosisKey, JSON.stringify(diagnosisData))
      }

      router.push("/dashboard/cv")
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi lưu chẩn đoán")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="cv" title="Chẩn đoán & Phân công">
        <div className="text-center py-8">Đang tải...</div>
      </DashboardLayout>
    )
  }

  if (!workOrder) {
    return (
      <DashboardLayout role="cv" title="Chẩn đoán & Phân công">
        <Alert variant="destructive">
          <AlertDescription>Không tìm thấy phiếu tiếp nhận</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="cv" title="Chẩn đoán & Phân công">
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
          </CardContent>
        </Card>

        {/* Diagnosis Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Technician Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>Ghi chú kỹ thuật viên</span>
              </CardTitle>
              <CardDescription>
                Ghi chú và nhận xét về tình trạng xe từ KTV
              </CardDescription>
            </CardHeader>
            <CardContent>
              {diagnosisData.technicianNotes ? (
                <div className="p-4 border rounded-md bg-gray-50">
                  <p className="whitespace-pre-line">{diagnosisData.technicianNotes}</p>
                </div>
              ) : (
                <div className="p-4 border rounded-md bg-gray-50 text-gray-500 italic">
                  KTV chưa nhập ghi chú chẩn đoán
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Repair Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                <span>Ghi chú sửa chữa</span>
              </CardTitle>
              <CardDescription>
                Các hạng mục sửa chữa và ghi chú chi tiết từ KTV
              </CardDescription>
            </CardHeader>
            <CardContent>
              {diagnosisData.repairNotes ? (
                <div className="p-4 border rounded-md bg-gray-50">
                  <p className="whitespace-pre-line">{diagnosisData.repairNotes}</p>
                </div>
              ) : (
                <div className="p-4 border rounded-md bg-gray-50 text-gray-500 italic">
                  KTV chưa nhập ghi chú sửa chữa
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment and Estimates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Thông tin bổ sung</span>
              </CardTitle>
              <CardDescription>Thông tin về độ ưu tiên và thời gian dự kiến từ KTV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority" className="mb-2 block">Độ ưu tiên</Label>
                  <div className="p-3 border rounded-md bg-gray-50">
                    {(() => {
                      const priorityMap = {
                        low: "Thấp",
                        normal: "Bình thường",
                        high: "Cao",
                        urgent: "Khẩn cấp"
                      };
                      return priorityMap[diagnosisData.priority as keyof typeof priorityMap] || diagnosisData.priority;
                    })()}
                  </div>
                </div>

                <div>
                  <Label htmlFor="estimatedCompletion" className="mb-2 block">Thời gian hoàn thành dự kiến</Label>
                  <div className="p-3 border rounded-md bg-gray-50">
                    {diagnosisData.estimatedCompletion ? (
                      new Date(diagnosisData.estimatedCompletion).toLocaleDateString("vi-VN")
                    ) : (
                      <span className="text-gray-500 italic">Chưa xác định</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="specialInstructions" className="mb-2 block">Hướng dẫn đặc biệt</Label>
                {diagnosisData.specialInstructions ? (
                  <div className="p-4 border rounded-md bg-gray-50">
                    <p className="whitespace-pre-line">{diagnosisData.specialInstructions}</p>
                  </div>
                ) : (
                  <div className="p-4 border rounded-md bg-gray-50 text-gray-500 italic">
                    KTV không có hướng dẫn đặc biệt
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="bg-blue-50 border-blue-200 mb-4">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-blue-600 mr-2" />
              <AlertDescription className="text-blue-700">
                Bạn đang xem thông tin chẩn đoán từ KTV. Vui lòng xem xét và duyệt để tạo báo giá.
              </AlertDescription>
            </div>
          </Alert>
          
          <div className="flex space-x-4">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                "Đang lưu..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Duyệt chẩn đoán & Tạo báo giá
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Quay lại
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
