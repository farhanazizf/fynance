import React, { useState, useCallback } from "react";
import {
  HomeOutlined,
  BarChartOutlined,
  PlusOutlined,
  AppstoreOutlined,
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
  const { logout, user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  console.log("MobileLayout: currentPage =", currentPage);

  const handlePageChange = useCallback(
    (page: string) => {
      console.log("MobileLayout: handlePageChange called with:", page);
      onPageChange(page);
    },
    [onPageChange]
  );

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
  ];

  const handleCategoriesClick = () => {
    setShowUserMenu(false);
    onPageChange("settings");
  };

  const handleBudgetClick = () => {
    setShowUserMenu(false);
    // For now, we can show a message or navigate to home
    // Later this can be expanded to a budget settings page
    alert("Budget settings coming soon!");
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto lg:max-w-6xl lg:grid lg:grid-cols-4 lg:gap-8 lg:px-8 lg:py-8">
      {/* User Menu Dropdown Overlay */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:col-span-3 lg:bg-white lg:rounded-2xl lg:shadow-sm lg:overflow-hidden relative">
        {/* User Avatar Dropdown */}
        <div className="lg:hidden absolute top-4 right-4 z-40">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <span className="text-white font-bold text-sm">
                {(
                  user?.displayName?.charAt(0) ||
                  user?.email?.charAt(0) ||
                  "U"
                ).toUpperCase()}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.displayName || user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <button
                  onClick={handleCategoriesClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <AppstoreOutlined className="w-4 h-4 mr-3" />
                  Categories
                </button>

                <button
                  onClick={handleBudgetClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <SettingOutlined className="w-4 h-4 mr-3" />
                  Budget Settings
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  onClick={handleLogoutClick}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogoutOutlined className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {children}
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block lg:space-y-4">
        {/* User Profile Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {(
                  user?.displayName?.charAt(0) ||
                  user?.email?.charAt(0) ||
                  "U"
                ).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {user?.displayName || user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>{" "}
          <div className="space-y-2">
            <button
              onClick={handleCategoriesClick}
              className="w-full flex items-center p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <AppstoreOutlined className="w-4 h-4 mr-3" />
              Categories
            </button>

            <button
              onClick={handleBudgetClick}
              className="w-full flex items-center p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <SettingOutlined className="w-4 h-4 mr-3" />
              Budget Settings
            </button>

            <div className="border-t border-gray-200 my-2"></div>

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center p-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogoutOutlined className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {/* Add Transaction Button */}
            <button
              onClick={() => handlePageChange("add")}
              className="w-full flex items-center p-3 rounded-lg transition-all bg-blue-500 text-white hover:bg-blue-600 shadow-md"
            >
              <PlusOutlined className="w-5 h-5 mr-3" />
              <span className="font-medium">Add Transaction</span>
            </button>

            {/* Regular Navigation Items */}
            {navItems
              .filter((item) => !item.isFloating)
              .map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handlePageChange(item.key)}
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-4 pt-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          {/* Add transaction floating button */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 z-10 pointer-events-none">
            {/* Larger touch target wrapper */}
            <div className="w-20 h-20 flex items-center justify-center pointer-events-auto">
              <button
                onClick={() => handlePageChange("add")}
                className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-90 hover:bg-blue-600 hover:shadow-xl"
                aria-label="Add transaction"
              >
                <PlusOutlined className="text-2xl text-white" />
              </button>
            </div>
          </div>

          {/* Regular navigation items */}
          <div className="flex items-center justify-between w-full">
            {/* Home Button */}
            <button
              onClick={() => handlePageChange("home")}
              className={`flex flex-col items-center py-3 px-8 transition-all duration-200 min-h-[60px] flex-1 active:scale-95 active:bg-blue-50 rounded-lg ${
                currentPage === "home" ? "text-blue-600" : "text-gray-400"
              }`}
              aria-label="Home"
            >
              <HomeOutlined
                className={`text-xl ${
                  currentPage === "home" ? "text-blue-600" : ""
                }`}
              />
              <span
                className={`text-xs mt-1 font-medium ${
                  currentPage === "home" ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Home
              </span>
            </button>

            {/* Empty space for plus button */}
            <div className="w-16 flex-shrink-0"></div>

            {/* Reports Button */}
            <button
              onClick={() => handlePageChange("reports")}
              className={`flex flex-col items-center py-3 px-8 transition-all duration-200 min-h-[60px] flex-1 active:scale-95 active:bg-blue-50 rounded-lg ${
                currentPage === "reports" ? "text-blue-600" : "text-gray-400"
              }`}
              aria-label="Reports"
            >
              <BarChartOutlined
                className={`text-xl ${
                  currentPage === "reports" ? "text-blue-600" : ""
                }`}
              />
              <span
                className={`text-xs mt-1 font-medium ${
                  currentPage === "reports" ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Reports
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Add bottom padding for mobile navigation */}
      <div className="lg:hidden h-28"></div>
    </div>
  );
};
