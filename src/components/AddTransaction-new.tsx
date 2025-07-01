import React, { useState, useEffect } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { categoryService, transactionService } from "../lib/firestore";
import type { Category, Transaction } from "../types";
import dayjs from "dayjs";

interface AddTransactionProps {
  onBack: () => void;
}

export const AddTransaction: React.FC<AddTransactionProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  // Form state
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      if (!user?.familyId) return;

      try {
        const familyCategories = await categoryService.getAll(user.familyId);
        setCategories(familyCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, [user?.familyId]);

  // Filter categories based on transaction type
  useEffect(() => {
    const filtered = categories.filter((cat) => cat.type === transactionType);
    setFilteredCategories(filtered);
    setSelectedCategory(""); // Reset selection when type changes
  }, [transactionType, categories]);

  const handleSave = async () => {
    if (!user?.familyId || !amount || !selectedCategory) {
      return;
    }

    setLoading(true);
    try {
      const transaction: Omit<Transaction, "id" | "createdAt" | "familyId"> = {
        amount: parseFloat(amount),
        type: transactionType,
        categoryId: selectedCategory,
        description: description,
        date: dayjs(date).toDate(),
        addedBy: user.uid,
      };

      await transactionService.create(user.familyId, transaction);

      // Reset form
      setAmount("");
      setSelectedCategory("");
      setDescription("");
      setDate(dayjs().format("YYYY-MM-DD"));

      onBack(); // Go back to dashboard
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = amount && selectedCategory && parseFloat(amount) > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftOutlined className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 ml-4">
              Add Transaction
            </h1>
          </div>
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Transaction Type Toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => setTransactionType("expense")}
            className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all ${
              transactionType === "expense"
                ? "bg-teal-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setTransactionType("income")}
            className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all ${
              transactionType === "income"
                ? "bg-teal-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-4 text-2xl font-semibold text-gray-800 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-400 pointer-events-none">
              $
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none appearance-none text-gray-800"
            >
              <option value="">Select category</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Grocery shopping"
            className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-800"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-800"
          />
        </div>
      </div>

      {/* Save Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={!isFormValid || loading}
          className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
            isFormValid && !loading
              ? "bg-gray-800 hover:bg-gray-900 active:scale-95"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </div>
          ) : (
            "Save"
          )}
        </button>
      </div>

      {/* Add bottom padding to account for fixed button */}
      <div className="h-24"></div>
    </div>
  );
};
