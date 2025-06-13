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
      "ktv@gara.com": { password: "123456", role: "ktv" },
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
          id: `demo-${account.role}-${Date.now()}`,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Gara Manager</CardTitle>
          <CardDescription>Hệ thống quản lý sửa chữa ô tô</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
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

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Tài khoản demo:</p>
            <p>CV: cv@gara.com / 123456</p>
            <p>KTV: ktv@gara.com / 123456</p>
            <p>Admin: admin@gara.com / 123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
