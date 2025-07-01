import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { createDefaultCategories } from "../utils/defaultCategories";

interface CreateDefaultCategoriesProps {
  onSuccess?: () => void;
}

export const CreateDefaultCategories: React.FC<
  CreateDefaultCategoriesProps
> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreateCategories = async () => {
    if (!user?.familyId) return;

    setLoading(true);
    try {
      await createDefaultCategories(user.familyId);
      setSuccess(true);
      onSuccess?.();

      // Auto hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating default categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-center space-x-2">
          <span className="text-green-600">✅</span>
          <span className="text-sm font-medium text-green-700">
            Default categories created successfully!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
      <div className="text-center">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Need Categories?
        </h3>
        <p className="text-xs text-blue-600 mb-3">
          Start with our pre-made Indonesian categories including common
          expenses like food, transport, and bills.
        </p>
        <button
          onClick={handleCreateCategories}
          disabled={loading || !user?.familyId}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            loading
              ? "bg-blue-200 text-blue-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating...
            </div>
          ) : (
            "Create Default Categories"
          )}
        </button>
      </div>
    </div>
  );
};
