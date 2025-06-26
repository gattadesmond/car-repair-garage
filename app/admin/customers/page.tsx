"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import RoleLayout from "@/components/role-layout"
import { getCustomers, type Customer } from "@/lib/demo-data"
import { CustomerItem } from "@/components/customer-item"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

  return (
    <RoleLayout role="admin" title="Quản lý khách hàng">
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
              <CustomerItem key={customer.id} customer={customer} role="admin" />
            ))
          )}
        </div>
      </div>
    </RoleLayout>
  )
}