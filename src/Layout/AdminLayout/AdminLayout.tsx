import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import adminimg from "../../assets/adminimg.svg";
import themeicon from "../../assets/Component 10.svg";
import { LayoutNavber } from "../LayoutNavber";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Auto-open sidebar on desktop on component mount
  useEffect(() => {
    const checkScreenSize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setSidebarOpen(isDesktop);
    };

    // Check on initial load
    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleclick = () => {
    alert("clicked");
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Hamburger Button for Mobile - Only show when sidebar is closed on mobile */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed cursor-pointer top-1 left-0 z-50 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
          >
            ☰
          </button>
        )}

        {/* Top Navigation */}
        <div className="lg:ml-0 z-9999">
          <LayoutNavber
            userImage={adminimg}
            userName="Darlene Robertson"
            userRole="Admin"
            themeIcon={themeicon}
            onThemeClick={handleclick}
          />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors lg:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;