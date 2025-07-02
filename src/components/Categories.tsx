import React, { useState, useEffect } from "react";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { categoryService } from "../lib/firestore";
import type { Category } from "../types";
import { message, Modal, Button } from "antd";

interface CategoriesProps {
  onBack: () => void;
}

interface CategoryFormData {
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
}

const DEFAULT_COLORS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
  "#6B7280",
  "#374151",
  "#1F2937",
];

const DEFAULT_ICONS = [
  "🏠",
  "🍽️",
  "🚗",
  "⛽",
  "🛒",
  "👕",
  "💊",
  "🎬",
  "📱",
  "💡",
  "🏫",
  "🎮",
  "✈️",
  "🏥",
  "💰",
  "📊",
  "💼",
  "🎁",
  "🎯",
  "📚",
  "🔧",
  "🎨",
  "🏃",
  "🍔",
];

export const Categories: React.FC<CategoriesProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    type: "expense",
    color: DEFAULT_COLORS[0],
    icon: DEFAULT_ICONS[0],
  });
  const [saving, setSaving] = useState(false);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      if (!user?.familyId) return;

      try {
        setLoading(true);
        const familyCategories = await categoryService.getAll(user.familyId);
        setCategories(familyCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
        message.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [user?.familyId]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      type: "expense",
      color: DEFAULT_COLORS[0],
      icon: DEFAULT_ICONS[0],
    });
    setEditingCategory(null);
  };

  // Handle add category
  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Handle edit category
  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon || DEFAULT_ICONS[0],
    });
    setEditingCategory(category);
    setShowAddModal(true);
  };

  // Handle save category
  const handleSave = async () => {
    if (!user?.familyId || !formData.name.trim()) {
      message.error("Please enter a category name");
      return;
    }

    // Check for duplicate names (excluding current editing category)
    const duplicateName = categories.find(
      (cat) =>
        cat.name.toLowerCase() === formData.name.toLowerCase() &&
        cat.id !== editingCategory?.id
    );

    if (duplicateName) {
      message.error("A category with this name already exists");
      return;
    }

    try {
      setSaving(true);

      if (editingCategory) {
        // Update existing category
        await categoryService.update(editingCategory.id, {
          name: formData.name.trim(),
          type: formData.type,
          color: formData.color,
          icon: formData.icon,
        });

        // Update local state
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id
              ? { ...cat, ...formData, name: formData.name.trim() }
              : cat
          )
        );

        message.success("Category updated successfully!");
      } else {
        // Create new category
        const newCategoryId = await categoryService.create(user.familyId, {
          name: formData.name.trim(),
          type: formData.type,
          color: formData.color,
          icon: formData.icon,
        });

        // Add to local state
        const newCategory: Category = {
          id: newCategoryId,
          familyId: user.familyId,
          name: formData.name.trim(),
          type: formData.type,
          color: formData.color,
          icon: formData.icon,
          createdAt: new Date(),
        };

        setCategories((prev) => [...prev, newCategory]);
        message.success("Category created successfully!");
      }

      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete category
  const handleDelete = (category: Category) => {
    Modal.confirm({
      title: "Delete Category",
      content: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await categoryService.delete(category.id);
          setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
          message.success("Category deleted successfully!");
        } catch (error) {
          console.error("Error deleting category:", error);
          message.error("Failed to delete category");
        }
      },
    });
  };

  // Filter categories by type
  const expenseCategories = categories.filter((cat) => cat.type === "expense");
  const incomeCategories = categories.filter((cat) => cat.type === "income");

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoadingOutlined className="text-3xl text-blue-500 mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Add Category
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* Expense Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
            Expense Categories ({expenseCategories.length})
          </h2>
          {expenseCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenseCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon || category.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {category.name}
                        </p>
                        <p className="text-xs text-gray-500">Expense</p>
                      </div>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <EditOutlined className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <DeleteOutlined className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No expense categories yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Add your first expense category to get started
              </p>
            </div>
          )}
        </div>

        {/* Income Categories */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            Income Categories ({incomeCategories.length})
          </h2>
          {incomeCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incomeCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon || category.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {category.name}
                        </p>
                        <p className="text-xs text-gray-500">Income</p>
                      </div>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <EditOutlined className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <DeleteOutlined className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No income categories yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Add your first income category to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      <Modal
        title={editingCategory ? "Edit Category" : "Add New Category"}
        open={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
          resetForm();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={saving}
            onClick={handleSave}
            disabled={!formData.name.trim()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {editingCategory ? "Update" : "Create"}
          </Button>,
        ]}
        width={600}
      >
        <div className="space-y-6 py-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              maxLength={50}
            />
          </div>

          {/* Category Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: "expense" }))
                }
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  formData.type === "expense"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: "income" }))
                }
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  formData.type === "income"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-10 gap-2">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-lg transition-all hover:scale-110 ${
                    formData.color === color
                      ? "ring-2 ring-gray-400 ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-12 gap-2 max-h-32 overflow-y-auto">
              {DEFAULT_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                  className={`w-8 h-8 rounded-lg transition-all hover:scale-110 flex items-center justify-center text-lg ${
                    formData.icon === icon
                      ? "bg-blue-100 ring-2 ring-blue-400"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: formData.color }}
              >
                {formData.icon}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {formData.name || "Category Name"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {formData.type}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
