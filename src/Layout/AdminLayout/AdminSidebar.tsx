import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import itimg from "../../assets/cube-group.png";
import overviewIcon from "../../assets/Dashbord/fi_7.svg";
import usermanagementicon from "../../assets/Dashbord/fi_5.svg";
import contentmanagementicon from "../../assets/Dashbord/fi_4.svg";
import Subscriptionicon from "../../assets/Dashbord/fi_6.svg";
import Analyticsicon from "../../assets/Dashbord/fi_3.svg";
import Supporticon from "../../assets/Dashbord/fi_2.svg";
import Settingsicon from "../../assets/Dashbord/fi_1.svg";
import { MdKeyboardDoubleArrowLeft, MdLogout } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/redux/features/auth/authSlice";
import Cookies from "js-cookie";


interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

const dispatch = useAppDispatch();

const handleLogout = () => {
  // Clear Redux state & localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("role");
  Cookies.remove("email");
  dispatch(logout());
         // clears Redux state
  
  // Optionally redirect to login page
  window.location.href = "/login"; // or use navigate from react-router
};




  const menuItems = [
    { path: "/admin", label: "Overview", icon: overviewIcon },
    { path: "/admin/users", label: "User Management", icon: usermanagementicon },
    { path: "/admin/content", label: "Content Management", icon: contentmanagementicon },
    { path: "/admin/subscription", label: "Subscription", icon: Subscriptionicon },
    { path: "/admin/analytics", label: "Analytics", icon: Analyticsicon },
    { path: "/admin/support", label: "Support", icon: Supporticon },
    { path: "/admin/settings", label: "Settings", icon: Settingsicon },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-[#EBEBEB] dark:bg-[#1F1F1F] border-r border-[#C6C8CB] dark:border-[#444444] text-white transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? (isCollapsed ? "w-20 translate-x-0" : "w-72 translate-x-0") 
            : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        {/* Close Button for mobile */}
        <div className="absolute top-4 right-4 lg:hidden z-50">
          <button
            onClick={() => setSidebarOpen(false)}
            className="hover:cursor-pointer w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Logo */}
        <div className={`px-3 ${!sidebarOpen ? 'lg:px-2' : ''}`}>
          <div
            className={`flex items-center gap-3 border-b border-b-[#C6C8CB] dark:border-b-[#444444] transition-all duration-300 ${
              isCollapsed || !sidebarOpen ? "justify-center px-2 py-5" : "px-6 py-6"
            }`}
          >
            <img
              className={`transition-all duration-300 ${
                isCollapsed || !sidebarOpen ? "w-10" : "w-11"
              }`}
              src={itimg}
              alt="Logo"
            />
            {(!isCollapsed && sidebarOpen) && (
              <h1 className="font-bold text-2xl text-[#111827] dark:text-white">
                B1 Italian
              </h1>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 justify-between flex flex-col overflow-y-auto mt-4 p-3">
          <div>
            {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 mb-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#111827] text-white dark:bg-[#333333] dark:text-white"
                    : "text-[#5e5e5e] hover:bg-[#111827]   hover:text-white dark:text-gray-300 dark:hover:bg-[#333333]"
                } ${(isCollapsed || !sidebarOpen) ? "justify-center px-2" : ""}`}
                onClick={() => {
                  // Close sidebar on mobile when a menu item is clicked
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-6 h-6 transition-transform duration-200 group-hover:scale-110"
                />
                {(!isCollapsed && sidebarOpen) && (
                  <span className=" dark:text-white  group-hover:text-white">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
          </div>

 {/* Logout */}
          <div>
  <button
    onClick={handleLogout}
    className={`group w-full  flex items-center gap-3 mb-2 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200
      text-[#5e5e5e] hover:bg-[#111827] hover:text-white 
      dark:text-gray-300 dark:hover:bg-[#333333]
      ${(isCollapsed || !sidebarOpen) ? "justify-center px-2" : ""}
    `}
  >
    <MdLogout className="w-6 h-6 text-red-500" />
    {!isCollapsed && <span  className="text-red-500">Logout</span>}
  </button>
</div>



        </nav>

        {/* Collapse / Expand Toggle (Desktop only) */}
        {sidebarOpen && (
          <div className="hidden lg:block border-t border-[#C6C8CB] dark:border-[#444444] p-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex cursor-pointer text-[#7E7E7E] dark:text-gray-300 hover:bg-[#111827] hover:text-white justify-center w-full gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#333333] transition-all duration-200"
            >
              {isCollapsed ? (
                <MdOutlineKeyboardDoubleArrowRight className="text-3xl" />
              ) : (
                <>
                  <MdKeyboardDoubleArrowLeft className="text-3xl" />
                  <span className="text-base pt-1 text-[#111827] dark:text-white">Collapse</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSidebar;