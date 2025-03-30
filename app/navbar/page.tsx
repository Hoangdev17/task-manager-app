'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const token = localStorage.getItem('access_token')
    const storedEmail = localStorage.getItem('user_email')
    if (token && storedEmail) {
      setIsLoggedIn(true)
      setEmail(storedEmail)
    }
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push('/')}>
          Task Manager
        </div>
        <ul className="flex space-x-6 items-center">
          <li>
            <button
              onClick={() => router.push('/')}
              className="hover:bg-blue-500 px-4 py-2 rounded-md transition duration-300"
            >
              Trang Chủ
            </button>
          </li>
          {isLoggedIn ? (
            <>
              <li className="text-sm">Welcome, {email}</li>
              <li>
                <button
                  onClick={() => {
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('user_email')
                    setIsLoggedIn(false)
                    setEmail(null)
                    router.push('/login')
                  }}
                  className="hover:bg-red-500 px-4 py-2 rounded-md transition duration-300"
                >
                  Đăng xuất
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  onClick={() => router.push('/login')}
                  className="hover:bg-green-500 px-4 py-2 rounded-md transition duration-300"
                >
                  Đăng nhập
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/register')}
                  className="hover:bg-green-500 px-4 py-2 rounded-md transition duration-300"
                >
                  Đăng ký
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar  // Đảm bảo xuất khẩu như default
