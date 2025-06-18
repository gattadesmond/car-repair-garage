"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/demo-data"

export default function DiagnosisPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    
    // Chuyển hướng dựa trên vai trò người dùng
    if (user?.role === "admin") {
      router.push(`/diagnosis/admin/${params.id}`)
    } else if (user?.role === "ktv") {
      router.push(`/diagnosis/ktv/${params.id}`)
    } else if (user?.role === "cv") {
      // CV có thể ở lại trang này, nhưng hiện tại chúng ta đã tách ra các trang riêng
      // nên sẽ chuyển hướng đến dashboard
      router.push(`/dashboard/cv`)
    } else {
      // Các vai trò khác sẽ được chuyển hướng về dashboard tương ứng
      router.push(`/dashboard/${user?.role || 'cv'}`)
    }
  }, [params.id, router])

  return null;
}
