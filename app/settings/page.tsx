"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Save, Database, Bell, Shield } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

export default function SettingsPage() {
  return (
    <DashboardLayout role="admin" title="Cài đặt hệ thống">
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Cài đặt chung</span>
            </CardTitle>
            <CardDescription>Cấu hình cơ bản của hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="garageName">Tên gara</Label>
                <Input id="garageName" defaultValue="Gara Manager" />
              </div>
              <div>
                <Label htmlFor="garagePhone">Số điện thoại</Label>
                <Input id="garagePhone" defaultValue="0123456789" />
              </div>
            </div>
            <div>
              <Label htmlFor="garageAddress">Địa chỉ</Label>
              <Input id="garageAddress" defaultValue="123 Đường ABC, Quận 1, TP.HCM" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Cài đặt thông báo</span>
            </CardTitle>
            <CardDescription>Quản lý các loại thông báo trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo phiếu mới</Label>
                <p className="text-sm text-gray-500">Gửi thông báo khi có phiếu tiếp nhận mới</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo hoàn thành</Label>
                <p className="text-sm text-gray-500">Gửi thông báo khi hoàn thành sửa chữa</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo quá hạn</Label>
                <p className="text-sm text-gray-500">Cảnh báo khi công việc quá thời gian dự kiến</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Cài đặt bảo mật</span>
            </CardTitle>
            <CardDescription>Cấu hình bảo mật và quyền truy cập</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Yêu cầu đổi mật khẩu định kỳ</Label>
                <p className="text-sm text-gray-500">Bắt buộc người dùng đổi mật khẩu mỗi 90 ngày</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Xác thực 2 bước</Label>
                <p className="text-sm text-gray-500">Bật xác thực 2 bước cho tài khoản admin</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Ghi log hoạt động</Label>
                <p className="text-sm text-gray-500">Lưu lại nhật ký hoạt động của người dùng</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Cài đặt dữ liệu</span>
            </CardTitle>
            <CardDescription>Quản lý sao lưu và khôi phục dữ liệu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Sao lưu tự động</Label>
                <p className="text-sm text-gray-500">Tự động sao lưu dữ liệu hàng ngày</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Sao lưu ngay
              </Button>
              <Button variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Khôi phục dữ liệu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Lưu cài đặt
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
