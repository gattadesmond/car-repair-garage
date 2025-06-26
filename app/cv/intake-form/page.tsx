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
import { Car, User, FileText, Save, Camera, AlertTriangle, Brush, Wrench, Zap, Snowflake, Sparkles } from "lucide-react"
import RoleLayout from "@/components/role-layout"
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
    selectedServices: [] as string[],
    notes: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"new" | "existing">("new")
  const [selectedCarId, setSelectedCarId] = useState<string>("")
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string }[]>([])
  const [availableYears, setAvailableYears] = useState<number[]>([])

  const conditionOptions = [
    "Đèn cảnh báo sáng",
    "Đèn check",
    "Đèn máy",
    "Rửa kính không tốt",
    "DVD/CD không tốt",
    "Bảo hiểm không tốt",
    "Tay ga cứng tay",
    "Chìa bị hỏng tay",
    "Cốp xe hỏng/móp tốt",
    "Gập gương không tốt",
    "Nắp bình dầu rách",
    "Logo (trước & sau) đủ",
    "Cơi bánh không tốt",
    "Cơi buột không tốt",
    "Chụp mang cả đủ",
    "Kích chân gió bị trơn",
    "Bảo sơn kém trơn xe",
  ]

  const serviceOptions = [
    { id: "cleaning", name: "Dọn Dẹp", icon: <Sparkles className="h-4 w-4 text-purple-500" /> },
    { id: "painting", name: "Đồng Sơn", icon: <Brush className="h-4 w-4 text-orange-500" /> },
    { id: "mechanical", name: "Cơ", icon: <Wrench className="h-4 w-4 text-blue-500" /> },
    { id: "electrical", name: "Điện", icon: <Zap className="h-4 w-4 text-yellow-500" /> },
    { id: "cooling", name: "Lạnh", icon: <Snowflake className="h-4 w-4 text-cyan-500" /> },
  ]
  
  // Các task mặc định cho từng loại dịch vụ
  const defaultServiceTasks = {
    cleaning: [
      { name: "Vệ sinh nội thất", description: "Làm sạch ghế, thảm, bảng điều khiển" },
      { name: "Vệ sinh ngoại thất", description: "Rửa xe, đánh bóng" },
      { name: "Vệ sinh khoang máy", description: "Làm sạch khoang máy" }
    ],
    painting: [
      { name: "Sơn lại phần bị trầy xước", description: "Sơn lại các vùng bị trầy xước" },
      { name: "Đồng nắn phần bị móp méo", description: "Sửa chữa các phần bị móp méo" },
      { name: "Thay thế phụ tùng bị hỏng", description: "Thay thế các phụ tùng bị hỏng" }
    ],
    mechanical: [
      { name: "Kiểm tra và sửa chữa động cơ", description: "Kiểm tra và sửa chữa các vấn đề về động cơ" },
      { name: "Kiểm tra và sửa chữa hệ thống phanh", description: "Kiểm tra và sửa chữa hệ thống phanh" },
      { name: "Kiểm tra và sửa chữa hệ thống treo", description: "Kiểm tra và sửa chữa hệ thống treo" }
    ],
    electrical: [
      { name: "Kiểm tra và sửa chữa hệ thống điện", description: "Kiểm tra và sửa chữa các vấn đề về hệ thống điện" },
      { name: "Kiểm tra và sửa chữa hệ thống đèn", description: "Kiểm tra và sửa chữa hệ thống đèn" },
      { name: "Kiểm tra và sửa chữa hệ thống âm thanh", description: "Kiểm tra và sửa chữa hệ thống âm thanh" }
    ],
    cooling: [
      { name: "Kiểm tra và sửa chữa hệ thống điều hòa", description: "Kiểm tra và sửa chữa các vấn đề về hệ thống điều hòa" },
      { name: "Nạp gas điều hòa", description: "Nạp gas cho hệ thống điều hòa" },
      { name: "Vệ sinh hệ thống điều hòa", description: "Vệ sinh hệ thống điều hòa" }
    ]
  }

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

  // Hàm xử lý sự kiện khi người dùng chọn dịch vụ
  const handleServiceToggle = (serviceId: string) => {
    const isSelected = formData.selectedServices.includes(serviceId);
    setFormData((prev) => ({
      ...prev,
      selectedServices: isSelected
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
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

      // Tạo các task nhỏ dựa trên các loại dịch vụ được chọn
      const repairTasks = []
      formData.selectedServices.forEach(serviceId => {
        const serviceTasks = defaultServiceTasks[serviceId as keyof typeof defaultServiceTasks] || []
        serviceTasks.forEach(task => {
          repairTasks.push({
            id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            service_type: serviceId,
            name: task.name,
            description: task.description,
            status: "pending",
            assigned_technician: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        })
      })

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
        selected_services: formData.selectedServices,
        repair_tasks: repairTasks, // Thêm các task nhỏ vào work order
        notes: formData.notes,
        received_by: "",
        received_date: new Date().toISOString().split("T")[0],
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
    <RoleLayout role="cv" title="Tạo phiếu tiếp nhận">
      <div 
        className="relative pb-6"
        style={{
          backgroundImage: "url('/images/car-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
        }}
      >
      <form onSubmit={handleSubmit} className="space-y-6 md:p-4">
        {/* Customer Information */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <span>Thông tin khách hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName" className="text-blue-800 font-medium">Tên khách hàng *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                  required
                  className="border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone" className="text-blue-800 font-medium">Số điện thoại *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                  required
                  className="border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="customerEmail" className="text-blue-800 font-medium">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))}
                className="border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Car Information */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <Car className="h-5 w-5 text-orange-600" />
              </div>
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
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
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
              <Label>Loại dịch vụ</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                {serviceOptions.map((service) => (
                  <div 
                    key={service.id} 
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 ${formData.selectedServices.includes(service.id) 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200"}`}
                  >
                    <button 
                      type="button"
                      className="flex items-center space-x-2 flex-grow text-left"
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                        {service.icon}
                      </div>
                      <div className="font-medium text-sm">
                        {service.name}
                      </div>
                    </button>
                    <button 
                      type="button"
                      className="ml-auto p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <div className="w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 bg-white">
                        {formData.selectedServices.includes(service.id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-blue-500">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Ghi chú thêm</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>


          </CardContent>
        </Card>

        {/* Image Upload Section */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <Camera className="h-5 w-5 text-purple-600" />
              </div>
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
          <Button 
            type="submit" 
            disabled={loading} 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 transition-all duration-200 shadow-lg hover:shadow-blue-300/50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Tạo phiếu tiếp nhận
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-200"
          >
            Hủy
          </Button>
        </div>
      </form>
      </div>
    </RoleLayout>
  )
}