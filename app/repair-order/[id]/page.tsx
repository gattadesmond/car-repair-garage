"use client"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, User, FileText, Calendar, ArrowLeft, Save, CheckCircle, Wrench, Camera, Eye } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import ImageUpload from "@/components/image-upload"
import { getWorkOrders, saveWorkOrders, type WorkOrder } from "@/lib/demo-data"

interface ImageFile {
  id: string
  file: File
  url: string
  type: "camera" | "upload"
}

interface SavedImage {
  id: string
  name: string
  type: "camera" | "upload"
  data: string // base64
  size: number
}

export default function RepairOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [diagnosisData, setDiagnosisData] = useState<any>(null)
  const [quotationData, setQuotationData] = useState<any>(null)
  const [images, setImages] = useState<ImageFile[]>([])
  const [savedImages, setSavedImages] = useState<SavedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [repairData, setRepairData] = useState({
    workStatus: "in_inspection",
    progressNotes: "",
    completedTasks: [] as string[],
    issuesEncountered: "",
    additionalRepairs: "",
    estimatedCompletion: "",
    actualHours: "",
    finalNotes: "",
  })

  useEffect(() => {
    fetchData()
  }, [params.id])

  const fetchData = () => {
    // Get work order
    const workOrders = getWorkOrders()
    const order = workOrders.find((w) => w.id === params.id)

    if (order) {
      setWorkOrder(order)

      // Get diagnosis data
      const diagnosisKey = `diagnosis-${params.id}`
      const storedDiagnosis = localStorage.getItem(diagnosisKey)
      if (storedDiagnosis) {
        setDiagnosisData(JSON.parse(storedDiagnosis))
      }

      // Get quotation data
      const quotationKey = `quotation-${params.id}`
      const storedQuotation = localStorage.getItem(quotationKey)
      if (storedQuotation) {
        setQuotationData(JSON.parse(storedQuotation))
      }

      // Get existing repair progress
      const repairKey = `repair-${params.id}`
      const storedRepair = localStorage.getItem(repairKey)
      if (storedRepair) {
        setRepairData(JSON.parse(storedRepair))
      }

      // Get saved images from intake
      const imageKey = `images-${params.id}`
      const storedImages = localStorage.getItem(imageKey)
      if (storedImages) {
        try {
          setSavedImages(JSON.parse(storedImages))
        } catch (error) {
          console.error("Error parsing images:", error)
        }
      }
    } else {
      setError("Không tìm thấy lệnh sửa chữa")
    }
    setLoading(false)
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      // Update work order status
      const workOrders = getWorkOrders()
      const orderIndex = workOrders.findIndex((w) => w.id === params.id)

      if (orderIndex !== -1) {
        workOrders[orderIndex] = {
          ...workOrders[orderIndex],
          status: repairData.workStatus as any,
          updated_at: new Date().toISOString(),
        }
        saveWorkOrders(workOrders)
      }

      // Save repair progress data
      const repairKey = `repair-${params.id}`
      localStorage.setItem(repairKey, JSON.stringify(repairData))

      // Save new repair images
      if (images.length > 0) {
        const imageData = await Promise.all(
          images.map(async (img) => ({
            id: img.id,
            name: img.file.name,
            type: img.type,
            data: await fileToBase64(img.file),
            size: img.file.size,
          })),
        )

        const repairImageKey = `repair-images-${params.id}`
        const existingRepairImages = localStorage.getItem(repairImageKey)
        const allRepairImages = existingRepairImages ? [...JSON.parse(existingRepairImages), ...imageData] : imageData

        localStorage.setItem(repairImageKey, JSON.stringify(allRepairImages))
      }

      // Cleanup URLs
      images.forEach((img) => URL.revokeObjectURL(img.url))

      if (repairData.workStatus === "completed") {
        router.push("/dashboard/ktv")
      } else {
        // Refresh the page to show updated data
        window.location.reload()
      }
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi cập nhật tiến độ")
    } finally {
      setSaving(false)
    }
  }

  const viewImage = (imageData: string) => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`<img src="${imageData}" style="max-width: 100%; height: auto;" />`)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      diagnosis: { label: "Chờ kiểm tra", variant: "secondary" as const },
      in_inspection: { label: "Đang kiểm tra", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  if (loading) {
    return (
      <DashboardLayout role="ktv" title="Lệnh sửa chữa">
        <div className="text-center py-8">Đang tải...</div>
      </DashboardLayout>
    )
  }

  if (!workOrder) {
    return (
      <DashboardLayout role="ktv" title="Lệnh sửa chữa">
        <Alert variant="destructive">
          <AlertDescription>Không tìm thấy lệnh sửa chữa</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="ktv" title="Lệnh sửa chữa">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Badge {...getStatusBadge(workOrder.status)}>{getStatusBadge(workOrder.status).label}</Badge>
        </div>

        {/* Work Order Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Thông tin lệnh sửa chữa</span>
            </CardTitle>
            <CardDescription>Mã lệnh: {workOrder.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Tên:</span>
                      <span>{workOrder.customer_name}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Thông tin xe</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Biển số:</span>
                      <span>{workOrder.license_plate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Xe:</span>
                      <span>{workOrder.car_info}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Yêu cầu khách hàng</h4>
                  <p className="text-sm text-gray-600">{workOrder.customer_request}</p>
                </div>

                {workOrder.estimated_completion && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Thời gian dự kiến</h4>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(workOrder.estimated_completion).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis Info */}
        {diagnosisData && (
          <Card>
            <CardHeader>
              <CardTitle>Chẩn đoán và đề xuất sửa chữa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {diagnosisData.preliminaryDiagnosis && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Chẩn đoán chi tiết</h4>
                    <p className="text-sm text-gray-600">{diagnosisData.preliminaryDiagnosis}</p>
                  </div>
                )}
                
                {diagnosisData.repairNotes && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Ghi chú sửa chữa</h4>
                    <p className="text-sm text-gray-600">{diagnosisData.repairNotes}</p>
                  </div>
                )}

                {diagnosisData.recommendedRepairs && diagnosisData.recommendedRepairs.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Hạng mục sửa chữa</h4>
                    <div className="space-y-2">
                      {diagnosisData.recommendedRepairs.map((repair: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Wrench className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{repair}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {diagnosisData.specialInstructions && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Hướng dẫn đặc biệt</h4>
                    <p className="text-sm text-gray-600">{diagnosisData.specialInstructions}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Original Images */}
        {savedImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Ảnh hiện trạng ban đầu ({savedImages.length} ảnh)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedImages.map((image) => (
                  <div key={image.id} className="relative">
                    <div className="aspect-square relative">
                      <img
                        src={image.data || "/placeholder.svg"}
                        alt={image.name}
                        className="w-full h-full object-cover rounded border"
                      />
                      <div className="absolute top-1 right-1">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => viewImage(image.data)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Repair Progress Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Tiến độ sửa chữa</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workStatus">Trạng thái công việc</Label>
                  <Select
                    value={repairData.workStatus}
                    onValueChange={(value) => setRepairData((prev) => ({ ...prev, workStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_inspection">Đang kiểm tra</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="actualHours">Số giờ thực tế</Label>
                  <Input
                    id="actualHours"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="Số giờ đã làm"
                    value={repairData.actualHours}
                    onChange={(e) => setRepairData((prev) => ({ ...prev, actualHours: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="progressNotes">Ghi chú tiến độ</Label>
                <Textarea
                  id="progressNotes"
                  placeholder="Mô tả công việc đã thực hiện, tiến độ hiện tại..."
                  value={repairData.progressNotes}
                  onChange={(e) => setRepairData((prev) => ({ ...prev, progressNotes: e.target.value }))}
                />
              </div>

              {diagnosisData?.recommendedRepairs && (
                <div>
                  <Label>Hạng mục đã hoàn thành</Label>
                  <div className="mt-2 space-y-2">
                    {diagnosisData.recommendedRepairs.map((repair: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`completed-${index}`}
                          checked={repairData.completedTasks.includes(repair)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRepairData((prev) => ({
                                ...prev,
                                completedTasks: [...prev.completedTasks, repair],
                              }))
                            } else {
                              setRepairData((prev) => ({
                                ...prev,
                                completedTasks: prev.completedTasks.filter((task) => task !== repair),
                              }))
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={`completed-${index}`} className="text-sm">
                          {repair}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="issuesEncountered">Vấn đề gặp phải (nếu có)</Label>
                <Textarea
                  id="issuesEncountered"
                  placeholder="Mô tả các vấn đề, khó khăn gặp phải trong quá trình sửa chữa..."
                  value={repairData.issuesEncountered}
                  onChange={(e) => setRepairData((prev) => ({ ...prev, issuesEncountered: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="additionalRepairs">Đề xuất sửa chữa bổ sung</Label>
                <Textarea
                  id="additionalRepairs"
                  placeholder="Các hạng mục sửa chữa bổ sung phát hiện trong quá trình làm việc..."
                  value={repairData.additionalRepairs}
                  onChange={(e) => setRepairData((prev) => ({ ...prev, additionalRepairs: e.target.value }))}
                />
              </div>

              {repairData.workStatus === "completed" && (
                <div>
                  <Label htmlFor="finalNotes">Ghi chú hoàn thành</Label>
                  <Textarea
                    id="finalNotes"
                    placeholder="Ghi chú cuối cùng, hướng dẫn bảo dưỡng cho khách hàng..."
                    value={repairData.finalNotes}
                    onChange={(e) => setRepairData((prev) => ({ ...prev, finalNotes: e.target.value }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Ảnh tiến độ sửa chữa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={10}
                label="Chụp ảnh tiến độ sửa chữa, kết quả hoàn thành"
              />
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
              ) : repairData.workStatus === "completed" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Hoàn thành sửa chữa
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu tiến độ
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
