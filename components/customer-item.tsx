"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Car, History } from "lucide-react"
import Link from "next/link"
import { type Customer } from "@/lib/demo-data"
import { carBrands } from "@/lib/car-data"

interface CustomerItemProps {
  customer: Customer
  role: "admin" | "cv"
}

export function CustomerItem({ customer, role }: CustomerItemProps) {
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
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-lg">{customer.name}</h3>
              {customer.last_service && <Badge variant="outline">Khách cũ</Badge>}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
              {customer.email && <span className="break-all">{customer.email}</span>}
            </div>

            {/* Cars */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm font-medium">
                <Car className="h-4 w-4" />
                <span>Xe của khách:</span>
              </div>
              {customer.cars.map((car, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-sm break-words">
                  <span className="font-medium">{car.license_plate}</span>
                  {" - "}
                  <span>
                    {getBrandNameById(car.brand)} {getModelNameById(car.brand, car.model)} ({car.year})
                  </span>
                </div>
              ))}
            </div>

            {customer.last_service && (
              <p className="text-xs text-gray-500">
                Lần sửa cuối: {new Date(customer.last_service).toLocaleDateString("vi-VN")}
              </p>
            )}
          </div>

          <div className="flex flex-row md:flex-col gap-2 md:min-w-[120px]">
            <Link 
              href={`/${role === "admin" ? "admin/customers" : "customers"}/${customer.id}`}
              className="flex-1 md:flex-none"
            >
              <Button variant="outline" size="sm" className="w-full">
                <History className="h-4 w-4 mr-1" />
                Lịch sử
              </Button>
            </Link>
            <Link 
              href={`/${role === "admin" ? "" : "cv/"}intake-form?customer=${customer.id}`}
              className="flex-1 md:flex-none"
            >
              <Button size="sm" className="w-full">
                Tạo phiếu mới
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}