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
import { Car, User, FileText, Calendar, Save, AlertTriangle, Settings } from "lucide-react"
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
                Nhập ghi chú và nhận xét về tình trạng xe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="technicianNotes"
                placeholder="Ghi chú và nhận xét của kỹ thuật viên về tình trạng xe..."
                value={diagnosisData.technicianNotes}
                onChange={(e) => setDiagnosisData((prev) => ({ ...prev, technicianNotes: e.target.value }))}
                className="mt-2"
                rows={8}
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

          <div className="flex space-x-4">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                "Đang lưu..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Hoàn tất chẩn đoán & Tạo báo giá
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
