"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Phone, Mail, Car, History, Calendar } from "lucide-react"
import Link from "next/link"
import RoleLayout from "@/components/role-layout"
import { getCustomers, type Customer } from "@/lib/demo-data"
import { carBrands } from "@/lib/car-data"

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
    <RoleLayout role="cv" title="Quản lý khách hàng">
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
          <Link href="/customers/new" className="block sm:inline-block">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Thêm khách hàng
            </Button>
          </Link>
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
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-blue-800">{customer.name}</h3>
                        {customer.last_service && <Badge variant="outline">Khách cũ</Badge>}
                      </div>

                      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-blue-500" />
                          <span>{customer.phone}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span className="truncate max-w-[200px]">{customer.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Cars */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          <Car className="h-4 w-4 text-blue-500" />
                          <span>Xe của khách:</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {customer.cars.map((car, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                              <span className="font-medium text-blue-700">{car.license_plate}</span>
                              {" - "}
                              <span className="text-gray-700">
                                {getBrandNameById(car.brand)} {getModelNameById(car.brand, car.model)} ({car.year})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {customer.last_service && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                          <Calendar className="h-3.5 w-3.5 text-blue-500" />
                          Lần sửa cuối: {new Date(customer.last_service).toLocaleDateString("vi-VN")}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 sm:ml-4 mt-2 sm:mt-0">
                      <Link href={`/customers/${customer.id}`} className="flex-1 sm:flex-auto">
                        <Button variant="outline" size="sm" className="w-full whitespace-nowrap">
                          <History className="h-4 w-4 mr-1.5" />
                          Lịch sử
                        </Button>
                      </Link>
                      <Link href={`/intake-form?customer=${customer.id}`} className="flex-1 sm:flex-auto">
                        <Button size="sm" className="w-full whitespace-nowrap">
                          <Plus className="h-4 w-4 mr-1.5" />
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
    </RoleLayout>
  )
}
