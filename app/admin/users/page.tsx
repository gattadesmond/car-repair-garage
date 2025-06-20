"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import RoleLayout from "@/components/role-layout"
import { getTechnicians, getCurrentUser } from "@/lib/demo-data"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
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

    if (currentUser.role !== "admin") {
      router.push(`/${currentUser.role}/dashboard`)
      return
    }

    setUser(currentUser)
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    // Get technicians from demo data
    const technicians = getTechnicians().map(tech => ({
      ...tech,
      role: "technician"
    }))

    // Add demo admin and customer service users
    const adminUsers = [
      {
        id: "admin1",
        full_name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        phone: "0901234567",
        status: "active"
      },
      {
        id: "cs1",
        full_name: "Customer Service Rep",
        email: "cs@example.com",
        role: "customer_service",
        phone: "0909876543",
        status: "active"
      }
    ]

    setUsers([...adminUsers, ...technicians])
    setLoading(false)
  }

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>
      case "technician":
        return <Badge className="bg-blue-500">Kỹ thuật viên</Badge>
      case "customer_service":
        return <Badge className="bg-green-500">CSKH</Badge>
      default:
        return <Badge className="bg-gray-500">{role}</Badge>
    }
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <RoleLayout role="admin" title="Quản lý người dùng">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-4">Không tìm thấy người dùng nào</div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{user.full_name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getRoleBadge(user.role)}
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}