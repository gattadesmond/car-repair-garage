"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, Mail, Lock, LogIn } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Demo authentication logic
    const demoAccounts = {
      "cv@gara.com": { password: "123456", role: "cv" },
      "ktv@gara.com": { password: "123456", role: "ktv", id: "tech-1" },
      "admin@gara.com": { password: "123456", role: "admin" },
    }

    const account = demoAccounts[email as keyof typeof demoAccounts]

    if (account && account.password === password) {
      // Store user info in localStorage for demo
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          role: account.role,
          id: account.id || `demo-${account.role}-${Date.now()}`,
        }),
      )

      // Redirect based on role
      if (account.role === "admin") {
        router.push("/dashboard/admin")
      } else if (account.role === "ktv") {
        router.push("/dashboard/ktv")
      } else {
        router.push("/dashboard/cv")
      }
    } else {
      setError("Email hoặc mật khẩu không đúng")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          src="/images/car-background.jpg" 
          alt="Car Background" 
          className="w-full h-full object-cover opacity-80"
        />
      </div>
      
      {/* Content */}
      <Card className="w-full max-w-md relative z-10 bg-white/90 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-24 h-24">
            <img 
              src="/images/garage-logo.svg" 
              alt="Garage Logo" 
              className="w-full h-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Gara Manager</CardTitle>
          <CardDescription>Hệ thống quản lý sửa chữa ô tô</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-800 font-medium">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors duration-200" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-800 font-medium">Mật khẩu</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors duration-200" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 transition-all duration-200 shadow-lg hover:shadow-blue-300/50" 
              disabled={loading}
            >
              {loading ? (
                "Đang đăng nhập..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-inner">
            <h3 className="text-center font-medium text-blue-800 mb-2">Tài khoản demo</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="p-2 bg-white rounded border border-blue-100 text-sm">
                <span className="font-semibold text-blue-700">CV:</span> cv@gara.com / 123456
              </div>
              <div className="p-2 bg-white rounded border border-blue-100 text-sm">
                <span className="font-semibold text-blue-700">KTV:</span> ktv@gara.com / 123456 (Nguyễn Văn Tài)
              </div>
              <div className="p-2 bg-white rounded border border-blue-100 text-sm">
                <span className="font-semibold text-blue-700">Admin:</span> admin@gara.com / 123456
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
