import { useState, useEffect } from "react";
import { UserSidebar } from "./UserSidebar";
import { Outlet } from "react-router-dom";
import { LayoutNavber } from "../LayoutNavber";
import adminimg from "../../assets/adminimg.svg";
import themeicon from "../../assets/Component 10.svg";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if the screen is mobile or desktop
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth <= 768); // Mobile breakpoint (adjust as needed)
  };

  useEffect(() => {
    // Check on initial load
    checkIfMobile();

    // Event listener to handle window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleclick = () => {
    alert("clicked");
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] dark:bg-[#191919]">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Show toggle button on mobile only when sidebar is closed */}
        {!sidebarOpen && isMobile && (
          <div className="p-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-8 h-8 bg-gray-900 text-white cursor-pointer rounded-full flex items-center justify-center"
            >
              ☰
            </button>
          </div>
        )}

        {/* Layout Navbar */}
        <LayoutNavber
          userImage={adminimg}
          userName="Darlene Robertson"
          userRole="Admin"
          themeIcon={themeicon}
          onThemeClick={handleclick}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
