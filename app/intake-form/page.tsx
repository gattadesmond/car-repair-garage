"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, User, FileText, Save, Camera, AlertTriangle } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import ImageUpload from "@/components/image-upload"
import {
  getCustomers,
  saveCustomers,
  getWorkOrders,
  saveWorkOrders,

  type Customer,
  type WorkOrder,
  type Car as CarType,

} from "@/lib/demo-data"
import { carBrands, generateYearsList } from "@/lib/car-data"
import SymptomSelector, { type SelectedSymptom } from "@/components/symptom-selector"

interface ImageFile {
  id: string
  file: File
  url: string
  type: "camera" | "upload"
}

export default function IntakeFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const customerId = searchParams.get("customer")

  const [customer, setCustomer] = useState<Customer | null>(null)

  const [images, setImages] = useState<ImageFile[]>([])
  const [formData, setFormData] = useState({
    // Customer info
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    // Car info
    licensePlate: "",
    brand: "",
    model: "",
    year: "",
    vinNumber: "",
    // Service info
    customerRequest: "",
    initialCondition: [] as string[],
    diagnosisSymptoms: [] as SelectedSymptom[],
    notes: "",

    receivedDate: new Date().toISOString().split("T")[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"new" | "existing">("new")
  const [selectedCarId, setSelectedCarId] = useState<string>("")
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string }[]>([])
  const [availableYears, setAvailableYears] = useState<number[]>([])

  const conditionOptions = [
    "Vết xước nhỏ",
    "Vết xước sâu",
    "Móp méo",
    "Hư hỏng đèn",
    "Lốp hư",
    "Kính vỡ",
    "Khác",
  ]

  useEffect(() => {
    if (customerId) {
      fetchCustomer(customerId)
    }
  }, [customerId])


  useEffect(() => {
    // Khi brand thay đổi, cập nhật danh sách model
    if (formData.brand) {
      const brand = carBrands.find((b) => b.id === formData.brand)
      if (brand) {
        setAvailableModels(brand.models)
        setFormData((prev) => ({ ...prev, model: "" })) // Reset model khi brand thay đổi
      } else {
        setAvailableModels([])
      }
    } else {
      setAvailableModels([])
    }
  }, [formData.brand])

  useEffect(() => {
    // Khi model thay đổi, cập nhật danh sách năm
    if (formData.brand && formData.model) {
      const brand = carBrands.find((b) => b.id === formData.brand)
      const model = brand?.models.find((m) => m.id === formData.model)
      if (model && model.years) {
        setAvailableYears(model.years)
      } else {
        setAvailableYears(generateYearsList())
      }
    } else {
      setAvailableYears([])
    }
  }, [formData.brand, formData.model])

  const fetchCustomer = (id: string) => {
    const customers = getCustomers()
    const foundCustomer = customers.find((c) => c.id === id)

    if (foundCustomer) {
      setCustomer(foundCustomer)
      setFormData((prev) => ({
        ...prev,
        customerName: foundCustomer.name,
        customerPhone: foundCustomer.phone,
        customerEmail: foundCustomer.email || "",
      }))

      // Nếu khách hàng có xe, mặc định chọn tab xe đã có
      if (foundCustomer.cars && foundCustomer.cars.length > 0) {
        setActiveTab("existing")
      }
    }
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      initialCondition: checked
        ? [...prev.initialCondition, condition]
        : prev.initialCondition.filter((c) => c !== condition),
    }))
  }

  const handleExistingCarSelect = (carId: string) => {
    setSelectedCarId(carId)
    if (customer) {
      const selectedCar = customer.cars.find((car) => car.id === carId)
      if (selectedCar) {
        setFormData((prev) => ({
          ...prev,
          licensePlate: selectedCar.license_plate,
          brand: selectedCar.brand,
          model: selectedCar.model,
          year: selectedCar.year?.toString() || "",
          vinNumber: selectedCar.vin_number || "",
        }))
      }
    }
  }

  // Hàm chuyển đổi File thành base64 để lưu trữ
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
    setLoading(true)
    setError("")

    try {
      // Create or update customer
      let customerData = customer
      if (!customerData) {
        const customers = getCustomers()
        const newCustomer: Customer = {
          id: `customer-${Date.now()}`,
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail || undefined,
          cars: [],
        }
        customers.push(newCustomer)
        saveCustomers(customers)
        customerData = newCustomer
      }

      // Create car record or use existing
      let carData: CarType
      if (activeTab === "existing" && selectedCarId) {
        // Sử dụng xe đã có
        const existingCar = customerData.cars.find((car) => car.id === selectedCarId)
        if (!existingCar) {
          throw new Error("Không tìm thấy thông tin xe")
        }
        carData = existingCar
      } else {
        // Tạo xe mới
        const newCar: CarType = {
          id: `car-${Date.now()}`,
          customer_id: customerData.id,
          license_plate: formData.licensePlate,
          brand: formData.brand,
          model: formData.model,
          year: Number.parseInt(formData.year),
          vin_number: formData.vinNumber,
        }

        // Update customer with new car
        const customers = getCustomers()
        const customerIndex = customers.findIndex((c) => c.id === customerData.id)
        if (customerIndex !== -1) {
          customers[customerIndex].cars.push(newCar)
          saveCustomers(customers)
        }
        carData = newCar
      }

      // Tìm tên hãng xe và model từ ID
      const brandObj = carBrands.find((b) => b.id === carData.brand)
      const modelObj = brandObj?.models.find((m) => m.id === carData.model)
      const brandName = brandObj?.name || carData.brand
      const modelName = modelObj?.name || carData.model

      // Chuyển đổi ảnh thành base64 để lưu trữ
      const imageData = await Promise.all(
        images.map(async (img) => ({
          id: img.id,
          name: img.file.name,
          type: img.type,
          data: await fileToBase64(img.file),
          size: img.file.size,
        })),
      )

      // Create work order
      const workOrders = getWorkOrders()
      const newWorkOrder: WorkOrder = {
        id: `work-order-${Date.now()}`,
        customer_id: customerData.id,
        car_id: carData.id,
        customer_name: formData.customerName,
        car_info: `${brandName} ${modelName} (${carData.year})`,
        license_plate: carData.license_plate,
        customer_request: formData.customerRequest,
        initial_condition: formData.initialCondition,
        diagnosis_symptoms: formData.diagnosisSymptoms.map(symptom => symptom.name),
        notes: formData.notes,
        received_by: "",
        received_date: formData.receivedDate,
        assigned_technician: "",
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      workOrders.push(newWorkOrder)
      saveWorkOrders(workOrders)

      // Lưu ảnh riêng biệt
      if (imageData.length > 0) {
        const imageKey = `images-${newWorkOrder.id}`
        localStorage.setItem(imageKey, JSON.stringify(imageData))
      }

      // Cleanup URLs
      images.forEach((img) => URL.revokeObjectURL(img.url))

      router.push(`/diagnosis/${newWorkOrder.id}`)
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi tạo phiếu tiếp nhận")
    } finally {
      setLoading(false)
    }
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

  return (
    <DashboardLayout role="cv" title="Tạo phiếu tiếp nhận">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Thông tin khách hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Tên khách hàng *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Số điện thoại *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Car Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>Thông tin xe</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nếu khách hàng có xe, hiển thị tab chọn xe */}
            {customer && customer.cars && customer.cars.length > 0 && (
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "new" | "existing")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="existing">Xe đã có</TabsTrigger>
                  <TabsTrigger value="new">Xe mới</TabsTrigger>
                </TabsList>
                <TabsContent value="existing" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customer.cars.map((car) => (
                      <div
                        key={car.id}
                        className={`p-3 border rounded-md cursor-pointer ${
                          selectedCarId === car.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                        onClick={() => handleExistingCarSelect(car.id)}
                      >
                        <div className="font-medium">{car.license_plate}</div>
                        <div className="text-sm text-gray-600">
                          {getBrandNameById(car.brand)} {getModelNameById(car.brand, car.model)} ({car.year})
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="new" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="licensePlate">Biển số xe *</Label>
                      <Input
                        id="licensePlate"
                        value={formData.licensePlate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, licensePlate: e.target.value }))}
                        required={activeTab === "new"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vinNumber">Số khung (VIN)</Label>
                      <Input
                        id="vinNumber"
                        value={formData.vinNumber}
                        onChange={(e) => setFormData((prev) => ({ ...prev, vinNumber: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="brand">Hãng xe *</Label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
                        required={activeTab === "new"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn hãng xe" />
                        </SelectTrigger>
                        <SelectContent>
                          {carBrands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="model">Dòng xe *</Label>
                      <Select
                        value={formData.model}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, model: value }))}
                        required={activeTab === "new"}
                        disabled={!formData.brand}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn dòng xe" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="year">Năm sản xuất *</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, year: value }))}
                        required={activeTab === "new"}
                        disabled={!formData.model}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableYears.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* Nếu không có khách hàng hoặc khách hàng không có xe, hiển thị form thêm xe mới */}
            {(!customer || !customer.cars || customer.cars.length === 0) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licensePlate">Biển số xe *</Label>
                    <Input
                      id="licensePlate"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, licensePlate: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vinNumber">Số khung (VIN)</Label>
                    <Input
                      id="vinNumber"
                      value={formData.vinNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, vinNumber: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="brand">Hãng xe *</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn hãng xe" />
                      </SelectTrigger>
                      <SelectContent>
                        {carBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="model">Dòng xe *</Label>
                    <Select
                      value={formData.model}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, model: value }))}
                      required
                      disabled={!formData.brand}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn dòng xe" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year">Năm sản xuất *</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, year: value }))}
                      required
                      disabled={!formData.model}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn năm" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Thông tin dịch vụ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerRequest">Yêu cầu của khách hàng *</Label>
              <Textarea
                id="customerRequest"
                value={formData.customerRequest}
                onChange={(e) => setFormData((prev) => ({ ...prev, customerRequest: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Tình trạng ban đầu</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {conditionOptions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      checked={formData.initialCondition.includes(condition)}
                      onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                    />
                    <Label htmlFor={condition} className="text-sm">
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Triệu chứng phát hiện</Label>
              <SymptomSelector
                selectedSymptoms={formData.diagnosisSymptoms}
                onSymptomsChange={(symptoms) =>
                  setFormData((prev) => ({ ...prev, diagnosisSymptoms: symptoms }))
                }
              />
            </div>

            <div>
              <Label htmlFor="notes">Ghi chú thêm</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="receivedDate">Ngày tiếp nhận *</Label>
              <Input
                id="receivedDate"
                type="date"
                value={formData.receivedDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, receivedDate: e.target.value }))}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Hình ảnh xe</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={10}
            />
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Đang xử lý...
              </>
            ) : (
              "Tạo phiếu tiếp nhận"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
