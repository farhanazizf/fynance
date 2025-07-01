import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface CategoriesProps {
  onBack: () => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onBack }) => {
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
            Categories
          </h1>
        </div>
      </div>

      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
        <p className="text-gray-600">
          Category management feature is under development
        </p>
      </div>
    </div>
  );
};
