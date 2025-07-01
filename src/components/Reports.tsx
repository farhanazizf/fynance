import React, { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface ReportsProps {
  onBack: () => void;
}

export const Reports: React.FC<ReportsProps> = ({ onBack }) => {
  const [timeframe, setTimeframe] = useState("week");

  const timeframes = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
  ];

  // Mock data for spending analysis
  const weeklyData = [
    { day: "Mon", amount: 45 },
    { day: "Tue", amount: 65 },
    { day: "Wed", amount: 85 },
    { day: "Thu", amount: 70 },
    { day: "Fri", amount: 60 },
    { day: "Sat", amount: 90 },
    { day: "Sun", amount: 55 },
  ];

  const topCategories = [
    { name: "Food", percentage: 35, amount: 1250 },
    { name: "Rent", percentage: 25, amount: 900 },
    { name: "Utility Bills", percentage: 20, amount: 720 },
  ];

  const maxAmount = Math.max(...weeklyData.map((d) => d.amount));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeftOutlined className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ml-4">
            Spending Analysis
          </h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Time frame selector */}
        <div className="flex space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setTimeframe(tf.key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                timeframe === tf.key
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-end space-x-2 h-48 mb-4">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-teal-500 rounded-t-md transition-all duration-500 ease-out"
                  style={{
                    height: `${(data.amount / maxAmount) * 100}%`,
                    minHeight: "8px",
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-2 font-medium">
                  {data.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top Categories
          </h3>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">
                    {category.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {category.percentage}% of total
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
