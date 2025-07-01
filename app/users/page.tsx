"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2, Users } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { getTechnicians, type Technician } from "@/lib/demo-data"

export default function UsersPage() {
  const [users, setUsers] = useState<Technician[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = () => {
    const technicians = getTechnicians()
    // Add some demo admin and CV users
    const allUsers = [
      ...technicians,
      {
        id: "admin-1",
        full_name: "Nguyễn Văn Admin",
        email: "manager@gara.com",
        role: "admin",
      },
      {
        id: "cv-1",
        full_name: "Trần Thị CV",
        email: "cv@gara.com",
        role: "cv",
      },
    ]
    setUsers(allUsers)
    setLoading(false)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadge = (role: string) => {
    const roleMap = {
      admin: { label: "Quản lý", variant: "default" as const },
      cv: { label: "Cố vấn DV", variant: "secondary" as const },
      ktv: { label: "Kỹ thuật viên", variant: "outline" as const },
    }
    return roleMap[role as keyof typeof roleMap] || { label: role, variant: "outline" as const }
  }

  return (
    <DashboardLayout role="admin" title="Quản lý người dùng">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Danh sách người dùng</span>
            </CardTitle>
            <CardDescription>Quản lý tài khoản người dùng trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Không tìm thấy người dùng nào</div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-medium text-blue-600">{user.full_name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{user.full_name}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Badge {...getRoleBadge(user.role)}>{getRoleBadge(user.role).label}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Sửa
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
