import { redirect } from "next/navigation"

export default async function HomePage() {
  // For demo purposes, redirect directly to login
  // In production, you would check authentication here
  redirect("/login")
}
