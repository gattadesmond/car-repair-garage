"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCustomers, type Customer, getCurrentUser } from "@/lib/demo-data"
import RoleLayout from "@/components/role-layout"
import { CustomerItem } from "@/components/customer-item"

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

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <RoleLayout role="cv" title="Quản lý khách hàng">
      <div className="md:p-6">
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
                <CustomerItem key={customer.id} customer={customer} role="cv" />
              ))
            )}
          </div>
        </div>
      </div>
    </RoleLayout>
  )
}