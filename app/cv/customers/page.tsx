"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Phone, Car, History } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCustomers, type Customer, getCurrentUser } from "@/lib/demo-data"
import { carBrands } from "@/lib/car-data"
import RoleLayout from "@/components/role-layout"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.role !== "cv") {
      router.push(`/${currentUser.role}/dashboard`)
      return
    }

    setUser(currentUser)
    fetchCustomers()
  }, [])

  const fetchCustomers = () => {
    setLoading(true)
    const data = getCustomers()
    setCustomers(data)
    setLoading(false)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.cars.some((car) => car.license_plate.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <RoleLayout role="cv" title="Quản lý khách hàng">
      <div className="p-6">
        <div className="space-y-6">
          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, SĐT, biển số..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm khách hàng
            </Button>
          </div>

          {/* Customer List */}
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : filteredCustomers.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">Không tìm thấy khách hàng nào</p>
                </CardContent>
              </Card>
            ) : (
              filteredCustomers.map((customer) => (
                <Card key={customer.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{customer.name}</h3>
                          {customer.last_service && <Badge variant="outline">Khách cũ</Badge>}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{customer.phone}</span>
                          </div>
                          {customer.email && <span>{customer.email}</span>}
                        </div>

                        {/* Cars */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1 text-sm font-medium">
                            <Car className="h-4 w-4" />
                            <span>Xe của khách:</span>
                          </div>
                          {customer.cars.map((car, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                              <span className="font-medium">{car.license_plate}</span>
                              {" - "}
                              <span>
                                {getBrandNameById(car.brand)} {getModelNameById(car.brand, car.model)} ({car.year})
                              </span>
                            </div>
                          ))}
                        </div>

                        {customer.last_service && (
                          <p className="text-xs text-gray-500 mt-2">
                            Lần sửa cuối: {new Date(customer.last_service).toLocaleDateString("vi-VN")}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Link href={`/customers/${customer.id}`}>
                          <Button variant="outline" size="sm">
                            <History className="h-4 w-4 mr-1" />
                            Lịch sử
                          </Button>
                        </Link>
                        <Link href={`/cv/intake-form?customer=${customer.id}`}>
                          <Button size="sm" className="w-full">
                            Tạo phiếu mới
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </RoleLayout>
  )
}