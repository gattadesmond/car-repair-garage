"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  useEffect(() => {
    // Chuyển hướng đến trang chi tiết khách hàng
    router.push(`/customers/${params.id}`)
  }, [params.id, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Đang chuyển hướng...</p>
    </div>
  )
}