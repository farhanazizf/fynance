import React, { useState, useEffect } from "react";
import {
  DashboardOutlined,
  PlusOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  selectedKey?: string;
  onMenuSelect?: (key: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  selectedKey = "dashboard",
  onMenuSelect,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    {
      key: "dashboard",
      icon: DashboardOutlined,
      label: "Dashboard",
    },
    {
      key: "add-transaction",
      icon: PlusOutlined,
      label: "Tambah",
    },
    {
      key: "reports",
      icon: BarChartOutlined,
      label: "Laporan",
    },
    {
      key: "categories",
      icon: SettingOutlined,
      label: "Kategori",
    },
  ];

  const handleMenuClick = (key: string) => {
    onMenuSelect?.(key);
    setSidebarOpen(false);
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Mobile Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300 mr-3 group active:scale-95"
            >
              <MenuOutlined className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
            </button>
            <div className="flex items-center">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
                <span className="text-white font-bold text-sm">F</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <span className="text-lg font-bold text-gray-800">FYnance</span>
                <p className="text-xs text-gray-500 leading-none font-medium">
                  Family Finance
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="relative w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 group"
          >
            <UserOutlined className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col">
              <div className="p-6 border-b border-gray-200/50 flex items-center justify-between bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="flex items-center">
                  <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold">F</span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-800">
                      FYnance
                    </span>
                    <p className="text-sm text-gray-500 leading-none font-medium">
                      Family Finance
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-3 hover:bg-white/60 rounded-2xl transition-all duration-300 group active:scale-95"
                >
                  <CloseOutlined className="w-5 h-5 text-gray-600 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300" />
                </button>
              </div>

              <div className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = selectedKey === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleMenuClick(item.key)}
                      className={`w-full flex items-center px-4 py-4 rounded-2xl transition-all duration-300 text-left group relative overflow-hidden ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl transform scale-[1.02]"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:scale-[1.02] active:scale-100"
                      }`}
                    >
                      {/* Background glow effect for selected state */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl blur-xl -z-10 transform scale-110"></div>
                      )}

                      <div
                        className={`p-2 rounded-xl mr-3 transition-all duration-300 ${
                          isSelected
                            ? "bg-white/20 shadow-lg"
                            : "bg-gray-100 group-hover:bg-white group-hover:shadow-md"
                        }`}
                      >
                        <IconComponent
                          className={`w-5 h-5 transition-all duration-300 ${
                            isSelected
                              ? "text-white scale-110"
                              : "text-gray-600 group-hover:text-blue-600 group-hover:scale-110"
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <span
                          className={`font-semibold text-sm transition-all duration-300 ${
                            isSelected ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {item.label}
                        </span>
                        {isSelected && (
                          <div className="w-8 h-0.5 bg-white/60 rounded-full mt-1 transition-all duration-300"></div>
                        )}
                      </div>

                      {/* Active indicator */}
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-200/50 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex items-center mb-4 p-4 bg-white rounded-2xl shadow-md border border-gray-100">
                  <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mr-4 shadow-lg">
                    <UserOutlined className="w-6 h-6" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {user?.displayName || user?.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Akun Keluarga
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">
                        Online
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-2xl transition-all duration-300 text-left group hover:shadow-lg active:scale-95"
                >
                  <div className="p-2 bg-red-100 group-hover:bg-white/20 rounded-xl mr-3 transition-all duration-300">
                    <LogoutOutlined className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto pb-20">
          <div className="p-4">{children}</div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-2xl">
          <div className="flex items-center justify-around px-2 py-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isSelected = selectedKey === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleMenuClick(item.key)}
                  className={`relative flex flex-col items-center py-3 px-4 transition-all duration-300 rounded-2xl ${
                    isSelected
                      ? "text-white transform scale-110"
                      : "text-gray-500 hover:text-gray-700 active:scale-95"
                  }`}
                >
                  {/* Background for selected state */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600 rounded-2xl shadow-lg"></div>
                  )}

                  {/* Icon container */}
                  <div
                    className={`relative p-2 rounded-xl transition-all duration-300 ${
                      isSelected ? "bg-white/20 shadow-md" : "hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 transition-all duration-300 ${
                        isSelected
                          ? "text-white scale-110"
                          : "group-hover:scale-110"
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`relative text-xs font-medium mt-1 transition-all duration-300 ${
                      isSelected ? "text-white font-semibold" : ""
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator dot */}
                  {isSelected && (
                    <div className="absolute -top-1 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}

                  {/* Ripple effect for tap */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 to-blue-600/0 hover:from-blue-400/10 hover:to-blue-600/10 transition-all duration-300"></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white font-bold">F</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">FYnance</h1>
              <p className="text-sm text-gray-500">Family Finance</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = selectedKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleMenuClick(item.key)}
                className={`w-full flex items-center px-4 py-4 rounded-2xl transition-all duration-300 text-left group relative overflow-hidden ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl transform scale-[1.02]"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:scale-[1.02] active:scale-100"
                }`}
              >
                {/* Background glow effect for selected state */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl blur-xl -z-10 transform scale-110"></div>
                )}

                <div
                  className={`p-2 rounded-xl mr-3 transition-all duration-300 ${
                    isSelected
                      ? "bg-white/20 shadow-lg"
                      : "bg-gray-100 group-hover:bg-white group-hover:shadow-md"
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 transition-all duration-300 ${
                      isSelected
                        ? "text-white scale-110"
                        : "text-gray-600 group-hover:text-blue-600 group-hover:scale-110"
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <span
                    className={`font-semibold text-sm transition-all duration-300 ${
                      isSelected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isSelected && (
                    <div className="w-8 h-0.5 bg-white/60 rounded-full mt-1 transition-all duration-300"></div>
                  )}
                </div>

                {/* Active indicator */}
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex items-center mb-4 p-4 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mr-4 shadow-lg">
              <UserOutlined className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800 truncate">
                {user?.displayName || user?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-gray-500 font-medium">Akun Keluarga</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-2xl transition-all duration-300 text-left group hover:shadow-lg active:scale-95"
          >
            <div className="p-2 bg-red-100 group-hover:bg-white/20 rounded-xl mr-3 transition-all duration-300">
              <LogoutOutlined className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm backdrop-blur-sm bg-white/95">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {menuItems.find((item) => item.key === selectedKey)?.label ||
                  "Dashboard"}
              </h2>
              <p className="text-sm text-gray-500">
                Kelola keuangan keluarga dengan mudah
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {user?.displayName || user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
