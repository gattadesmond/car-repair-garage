import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { AlertCircle, Wrench, Car, Settings } from "lucide-react"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" }
    case "diagnosis":
      return { label: "Đang chẩn đoán", color: "bg-blue-100 text-blue-800 hover:bg-blue-100" }
    case "in_progress":
      return { label: "Đang sửa chữa", color: "bg-blue-100 text-blue-800 hover:bg-blue-100" }
    case "completed":
      return { label: "Hoàn thành", color: "bg-green-100 text-green-800 hover:bg-green-100" }
    default:
      return { label: status, color: "bg-gray-100 text-gray-800 hover:bg-gray-100" }
  }
}

export function getServiceTypeBadge(type: string) {
  switch (type) {
    case "maintenance":
      return { label: "Bảo dưỡng", color: "bg-blue-100 text-blue-800 hover:bg-blue-100" }
    case "repair":
      return { label: "Sửa chữa", color: "bg-amber-100 text-amber-800 hover:bg-amber-100" }
    case "diagnosis":
      return { label: "Chẩn đoán", color: "bg-purple-100 text-purple-800 hover:bg-purple-100" }
    default:
      return { label: type || "Khác", color: "bg-gray-100 text-gray-800 hover:bg-gray-100" }
  }
}

export function getServiceTypeIcon(type: string): React.ReactElement {
  switch (type) {
    case "maintenance":
      return React.createElement(Wrench, { className: "h-4 w-4 text-blue-600" });
    case "repair":
      return React.createElement(Settings, { className: "h-4 w-4 text-amber-600" });
    case "diagnosis":
      return React.createElement(AlertCircle, { className: "h-4 w-4 text-purple-600" });
    default:
      return React.createElement(Car, { className: "h-4 w-4 text-gray-600" });
  }
}
