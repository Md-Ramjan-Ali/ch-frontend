"use client"
import { ModeToggle } from "@/components/ThemeToggle/mode-toggle"
import { useGetMeQuery } from "@/redux/features/auth/authApi"
import React, { useState } from "react"
 import { useNavigate } from "react-router-dom"

interface UserHeaderProps {
  userImage: string
  userName: string
  userRole: string
  themeIcon: string
  onThemeClick?: () => void
}

export const LayoutNavber: React.FC<UserHeaderProps> = ({
  userImage,

}) => {
  const [showLogout, setShowLogout] = useState(false)
  const navigate = useNavigate()
  const handleProfileClick = () => {
    setShowLogout((prev) => !prev)
  }
  const handleLogout = () => {
    navigate("/") 
  }

  const { data: userData } = useGetMeQuery({});
  const role = userData?.data?.role;
  // const email = userData?.data?.email;
  // const subscriptionPlan = userData?.data?.subscriptionPlan;
  // const trialAvailable = userData?.data?.trialAvailable;
const name=userData?.data?.name
 //(role,email,subscriptionPlan,trialAvailable,name)
  
  return (
    <div className="px-10 z-9999 bg-white border-b dark:border-b-[#536580] border-b-[#b9b6b6] py-5 flex items-center justify-between dark:bg-gray-900">
      <div className="flex items-center gap-3 cursor-pointer" onClick={handleProfileClick}>
        <img
          src={userImage}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-sm text-gray-900 dark:text-white">{name || "Guest"} </div>
          <div className="text-base text-gray-500 dark:text-gray-300">{role}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
      {showLogout && (
        <div className="absolute top-5 left-70 transform -translate-x-1/2 w-full flex justify-center">
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
