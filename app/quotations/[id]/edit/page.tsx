"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Car, User, FileText, Calculator, Save, Plus, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { getWorkOrders, saveWorkOrders, type WorkOrder } from "@/lib/demo-data"

interface QuotationItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
  type: "parts" | "labor"
}

export default function EditQuotationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [diagnosisData, setDiagnosisData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([])
  const [quotationNotes, setQuotationNotes] = useState("")
  const [taxRate, setTaxRate] = useState(10) // 10% VAT

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
        const diagnosis = JSON.parse(storedDiagnosis)
        setDiagnosisData(diagnosis)

        // Initialize quotation items based on diagnosis
        const initialItems: QuotationItem[] = []

        // Add labor items
        if (diagnosis.laborHours) {
          initialItems.push({
            id: `labor-${Date.now()}`,
            description: "Công lao động",
            quantity: Number.parseFloat(diagnosis.laborHours),
            unit_price: 200000, // 200k per hour
            total: Number.parseFloat(diagnosis.laborHours) * 200000,
            type: "labor",
          })
        }

        // Add parts based on recommended repairs
        diagnosis.recommendedRepairs?.forEach((repair: string, index: number) => {
          initialItems.push({
            id: `parts-${Date.now()}-${index}`,
            description: repair,
            quantity: 1,
            unit_price: 500000, // Default 500k
            total: 500000,
            type: "parts",
          })
        })

        setQuotationItems(initialItems)
      }
    } else {
      setError("Không tìm thấy phiếu tiếp nhận")
    }
    setLoading(false)
  }

  const addItem = (type: "parts" | "labor") => {
    const newItem: QuotationItem = {
      id: `${type}-${Date.now()}`,
      description: "",
      quantity: 1,
      unit_price: 0,
      total: 0,
      type,
    }
    setQuotationItems([...quotationItems, newItem])
  }

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setQuotationItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unit_price") {
            updatedItem.total = updatedItem.quantity * updatedItem.unit_price
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const removeItem = (id: string) => {
    setQuotationItems((items) => items.filter((item) => item.id !== id))
  }

  const calculateSubtotal = () => {
    return quotationItems.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTax = () => {
    return (calculateSubtotal() * taxRate) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
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
          status: "approved",
          updated_at: new Date().toISOString(),
        }
        saveWorkOrders(workOrders)

        // Save quotation data
        const quotationKey = `quotation-${params.id}`
        const quotationData = {
          items: quotationItems,
          subtotal: calculateSubtotal(),
          tax_rate: taxRate,
          tax_amount: calculateTax(),
          total_amount: calculateTotal(),
          notes: quotationNotes,
          created_at: new Date().toISOString(),
        }
        localStorage.setItem(quotationKey, JSON.stringify(quotationData))
      }

      router.push("/quotations")
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi lưu báo giá")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="cv" title="Lập báo giá">
        <div className="text-center py-8">Đang tải...</div>
      </DashboardLayout>
    )
  }

  if (!workOrder) {
    return (
      <DashboardLayout role="cv" title="Lập báo giá">
        <Alert variant="destructive">
          <AlertDescription>Không tìm thấy phiếu tiếp nhận</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="cv" title="Lập báo giá">
      <div className="space-y-6">
        {/* Work Order Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Thông tin phiếu sửa chữa</span>
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
              </div>
              <div>
                {diagnosisData && (
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Vấn đề phát hiện:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {diagnosisData.issuesFound?.map((issue: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quotation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Phụ tùng</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem("parts")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phụ tùng
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quotationItems
                  .filter((item) => item.type === "parts")
                  .map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <Input
                          placeholder="Mô tả phụ tùng"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="1"
                          placeholder="SL"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          min="0"
                          placeholder="Đơn giá"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, "unit_price", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-1 text-right font-medium">{item.total.toLocaleString("vi-VN")}</div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Labor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Công lao động</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem("labor")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm công việc
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quotationItems
                  .filter((item) => item.type === "labor")
                  .map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <Input
                          placeholder="Mô tả công việc"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="Giờ"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          min="0"
                          placeholder="Giá/giờ"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, "unit_price", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-1 text-right font-medium">{item.total.toLocaleString("vi-VN")}</div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Tổng kết báo giá</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span className="font-medium">{calculateSubtotal().toLocaleString("vi-VN")} VNĐ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Thuế VAT:</span>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number.parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <span>%</span>
                    <span className="font-medium w-32 text-right">{calculateTax().toLocaleString("vi-VN")} VNĐ</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{calculateTotal().toLocaleString("vi-VN")} VNĐ</span>
                </div>

                <div className="mt-4">
                  <Label htmlFor="quotationNotes">Ghi chú báo giá</Label>
                  <Textarea
                    id="quotationNotes"
                    placeholder="Ghi chú về bảo hành, điều kiện thanh toán..."
                    value={quotationNotes}
                    onChange={(e) => setQuotationNotes(e.target.value)}
                    className="mt-2"
                  />
                </div>
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
                  Lưu báo giá
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
