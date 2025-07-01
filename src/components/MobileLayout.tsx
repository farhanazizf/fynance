import React from "react";
import {
  HomeOutlined,
  BarChartOutlined,
  PlusOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  currentPage,
  onPageChange,
}) => {
  const { logout } = useAuth();

  const navItems = [
    {
      key: "home",
      icon: HomeOutlined,
      label: "Home",
    },
    {
      key: "reports",
      icon: BarChartOutlined,
      label: "Reports",
    },
    {
      key: "add",
      icon: PlusOutlined,
      label: "Add",
      isFloating: true,
    },
    {
      key: "categories",
      icon: SettingOutlined,
      label: "Settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto lg:max-w-6xl lg:grid lg:grid-cols-4 lg:gap-8 lg:px-8 lg:py-8">
      {/* Mobile Header with Logout button - Only visible on mobile */}
      <div className="lg:hidden bg-white flex justify-between items-center p-4 shadow-sm border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <h1 className="text-lg font-bold">FYnance</h1>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
          aria-label="Logout"
        >
          <LogoutOutlined className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:col-span-3 lg:bg-white lg:rounded-2xl lg:shadow-sm lg:overflow-hidden">
        {children}
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block lg:space-y-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {navItems.slice(0, -1).map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onPageChange(item.key)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-teal-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.key;

            if (item.isFloating) {
              return (
                <button
                  key={item.key}
                  onClick={() => onPageChange(item.key)}
                  className="relative -top-6 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </button>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => onPageChange(item.key)}
                className={`flex flex-col items-center py-2 px-4 transition-all ${
                  isActive ? "text-teal-600" : "text-gray-400"
                }`}
              >
                <IconComponent
                  className={`w-6 h-6 ${isActive ? "text-teal-600" : ""}`}
                />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add bottom padding for mobile navigation */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};
