'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "./navbar/page"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const token = localStorage.getItem("access_token")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleStartClick = () => {
    if (isLoggedIn) {
      // Nếu người dùng đã đăng nhập, chuyển hướng đến trang Dashboard
      router.push("/dashboard")
    } else {
      // Nếu chưa đăng nhập, có thể chuyển hướng đến trang đăng nhập
      router.push("/login")
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 text-gray-800">
      <Navbar />
      <h1 className="text-4xl font-bold mb-4">🎯 Task Manager</h1>
      <p className="text-lg mb-6 text-center max-w-md">
        Chào mừng bạn đến với ứng dụng quản lý công việc. Dễ dàng tạo, theo dõi và hoàn thành công việc mỗi ngày.
      </p>
      <button
        onClick={handleStartClick}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Bắt đầu ngay
      </button>
    </main>
  )
}
