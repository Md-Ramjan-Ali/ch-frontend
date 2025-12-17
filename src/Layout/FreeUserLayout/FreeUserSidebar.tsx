

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import itimg from "../../assets/cube-group.png";
import overviewIcon from "../../assets/Dashbord/fi_18.svg";
import Practiceicon from "../../assets/Dashbord/fi_17.svg";
import TrendingUpicon from "../../assets/Dashbord/fi_16.svg";
import Brainicon from "../../assets/Dashbord/fi_15.svg";
import Usersicon from "../../assets/Dashbord/fi_14.svg";
import Calendaricon from "../../assets/Dashbord/fi_13.svg";
import Settingsicon from "../../assets/Dashbord/fi_1.svg";
import supporticon from "../../assets/Dashbord/support.svg";
import {
    MdKeyboardDoubleArrowLeft,
    MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export const FreeUserSidebar: React.FC<SidebarProps> = ({
    sidebarOpen,
    setSidebarOpen,
}) => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const userData = localStorage.getItem("userData");
    const { role } = userData ? JSON.parse(userData) : {};

    //("User Role:", role);

    // ✅ Define all sidebar items
    const menuItems = [
        { path: "/freeuser", label: "Pro Overview", icon: overviewIcon, },
        { path: "/freeuser/practice", label: "Practice", icon: Practiceicon },
        { path: "/freeuser/analytics", label: "Analytics", icon: TrendingUpicon },
        { path: "/freeuser/flashcards", label: "Flashcards", icon: Brainicon },
        { path: "/freeuser/leaderboard", label: "Pro Leaderboard", icon: Usersicon, proOnly: true },
        { path: "/freeuser/planner", label: "AI Study Planner", icon: Calendaricon, proOnly: true },
        { path: "/freeuser/settings", label: "Settings", icon: Settingsicon },
        { path: "/freeuser/support", label: "Support", icon: supporticon },
    ];

    return (
        <div
            className={`relative flex flex-col bg-[#EBEBEB]  border-r border-[#302f2f] transition-all duration-300 ease-in-out dark:bg-[#100413]
        ${sidebarOpen
                    ? isCollapsed
                        ? "w-20"
                        : "w-70"
                    : "w-0 overflow-hidden"
                }`}
        >
            {/* Mobile Close Button */}
            {sidebarOpen && (
                <div className="absolute top-2 right-2 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:cursor-pointer"
                    >
                        ✖
                    </button>
                </div>
            )}

            {/* Logo */}
            {sidebarOpen && (
                <div className="px-3">
                    <div
                        className={`flex items-center gap-3 border-b border-b-[#252525] transition-all duration-300 
              ${isCollapsed ? "justify-center px-2 py-5" : "px-6 py-6"}`}
                    >
                        <img
                            src={itimg}
                            alt="Logo"
                            className={`transition-all duration-300 ${isCollapsed ? "w-10" : "w-11"}`}
                        />
                        {!isCollapsed && (
                            <h1 className="font-bold text-2xl text-[#111827] dark:text-white">B1 Italian</h1>
                        )}
                    </div>
                </div>
            )}

            {/* Menu Items */}
            {sidebarOpen && (
                <nav className="flex-1 overflow-y-auto mt-4 px-3">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const isDisabled = role === "freeuser" && item.proOnly;

                        return (
                            <Link
                                key={item.path}
                                to={isDisabled ? "#" : item.path}
                                onClick={(e) => isDisabled && e.preventDefault()}
                                className={`group flex font-semibold items-center gap-3 mb-2 px-4 py-3 rounded-lg transition-all duration-200 
                  ${isActive
                                        ? "bg-[#111827] text-white"
                                        : isDisabled
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-[#585858] hover:bg-[#111827] hover:text-white"
                                    }
                  ${isCollapsed ? "justify-center px-2" : ""}
                `}
                                title={isDisabled ? "Pro feature – upgrade to access" : ""}
                            >
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    className={`w-6 h-6 transition-transform duration-200 group-hover:scale-110 ${isDisabled ? "opacity-50" : ""
                                        }`}
                                />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
            )}

            {/* Collapse / Expand Toggle (Desktop only) */}
            {sidebarOpen && (
                <div className="hidden lg:block border-t border-[#C6C8CB] p-3">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex items-center cursor-pointer justify-center w-full gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#474747] dark:text-white text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    >
                        {isCollapsed ? (
                            <MdOutlineKeyboardDoubleArrowRight className="text-3xl" />
                        ) : (
                            <div className="flex items-start gap-4">
                                <MdKeyboardDoubleArrowLeft className="text-3xl" />
                                <span className="text-base pt-1">Collapse</span>
                            </div>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};
