"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardCVRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the correct path
    router.replace("/cv/dashboard")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Đang chuyển hướng...</h1>
        <p>Đang chuyển đến trang Dashboard Cố vấn</p>
      </div>
    </div>
  )
}