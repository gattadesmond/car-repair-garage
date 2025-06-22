"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import RoleLayout from "@/components/role-layout"
import { getWorkOrders, getCustomers, getTechnicians, getCurrentUser } from "@/lib/demo-data"

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0,
    topTechnicians: [] as any[],
    monthlyStats: [] as any[],
  })
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
    generateReport()
  }, [timeRange])

  const generateReport = () => {
    setLoading(true)
    const workOrders = getWorkOrders()
    const customers = getCustomers()
    const technicians = getTechnicians()

    // Calculate basic stats
    const completedOrders = workOrders.filter((o) => o.status === "completed")
    const totalRevenue = completedOrders.length * 2500000 // Estimated average
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0

    // Top technicians by completed orders
    const techStats = technicians.map((tech) => ({
      name: tech.full_name,
      completed: workOrders.filter((o) => o.assigned_technician === tech.id && o.status === "completed").length,
      inInspection: workOrders.filter((o) => o.assigned_technician === tech.id && o.status === "diagnosis").length,
    }))

    setReportData({
      totalRevenue,
      totalOrders: workOrders.length,
      completedOrders: completedOrders.length,
      averageOrderValue,
      topTechnicians: techStats.sort((a, b) => b.completed - a.completed),
      monthlyStats: [], // Simplified for demo
    })
    
    setLoading(false)
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <RoleLayout role="admin" title="Báo cáo">
      <div className="space-y-6">
        {/* Report Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Báo cáo tổng quan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Tuần này</SelectItem>
                    <SelectItem value="month">Tháng này</SelectItem>
                    <SelectItem value="quarter">Quý này</SelectItem>
                    <SelectItem value="year">Năm này</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Doanh thu</p>
                  <p className="text-2xl font-bold">{(reportData.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Tổng đơn</p>
                  <p className="text-2xl font-bold">{reportData.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Hoàn thành</p>
                  <p className="text-2xl font-bold">{reportData.completedOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Giá trị TB</p>
                  <p className="text-2xl font-bold">{(reportData.averageOrderValue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Top Technicians */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất kỹ thuật viên</CardTitle>
            <CardDescription>Thống kê theo số lượng công việc hoàn thành</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topTechnicians.map((tech, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{tech.name}</h4>
                      <p className="text-sm text-gray-500">Kỹ thuật viên</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Hoàn thành</p>
                      <Badge variant="default">{tech.completed}</Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Đang kiểm tra</p>
                      <Badge variant="outline">{tech.inInspection}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Báo cáo theo thời gian
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Báo cáo khách hàng
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Báo cáo doanh thu
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Xuất dữ liệu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất Excel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleLayout>
  )
}