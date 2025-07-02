import React, { useState, useEffect } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { categoryService, transactionService } from "../lib/firestore";
import type { Category, Transaction } from "../types";
import { formatIDR, formatNumber, IDR_SYMBOL } from "../utils/currency";
import { CreateDefaultCategories } from "./CreateDefaultCategories";
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
  const [displayAmount, setDisplayAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [categorySearch, setCategorySearch] = useState("");
  const [time, setTime] = useState(dayjs().format("HH:mm"));

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      if (!user?.familyId) return;

      try {
        const familyCategories = await categoryService.getAll(user.familyId);
        setCategories(familyCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
        // Set empty array to show create categories option
        setCategories([]);
      }
    };

    loadCategories();
  }, [user?.familyId]);

  // Filter categories based on transaction type and search
  useEffect(() => {
    const filtered = categories.filter((cat) => {
      const matchesType = cat.type === transactionType;
      const matchesSearch =
        categorySearch === "" ||
        cat.name.toLowerCase().includes(categorySearch.toLowerCase());
      return matchesType && matchesSearch;
    });
    setFilteredCategories(filtered);
    setSelectedCategory(""); // Reset selection when type changes
  }, [transactionType, categories, categorySearch]);

  // Handle amount input with IDR formatting
  const handleAmountChange = (value: string) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/[^\d]/g, "");

    if (numericValue === "") {
      setAmount("");
      setDisplayAmount("");
      return;
    }

    // Convert to number and check maximum limit (100 billion IDR)
    const numberValue = parseInt(numericValue, 10);
    if (numberValue > 100_000_000_000) {
      return; // Don't update if exceeds maximum
    }

    setAmount(numberValue.toString());
    setDisplayAmount(formatNumber(numberValue));
  };

  const handleSave = async () => {
    if (!user?.familyId || !amount || !selectedCategory) {
      // Add visual feedback for incomplete form
      if (!amount) {
        // Focus on amount input
        const amountInput = document.querySelector(
          'input[inputMode="numeric"]'
        ) as HTMLInputElement;
        if (amountInput) {
          amountInput.focus();
          amountInput.classList.add("ring-2", "ring-red-500");
          setTimeout(() => {
            amountInput.classList.remove("ring-2", "ring-red-500");
          }, 2000);
        }
      }
      return;
    }

    setLoading(true);
    try {
      // Combine date and time for accurate datetime
      const datetime = dayjs(`${date} ${time}`);

      const transaction: Omit<Transaction, "id" | "createdAt" | "familyId"> = {
        amount: parseFloat(amount),
        type: transactionType,
        categoryId: selectedCategory,
        description: description,
        date: datetime.toDate(),
        addedBy: user.email || user.uid, // Use email if available, fallback to UID
      };

      await transactionService.create(user.familyId, transaction);

      // Reset form
      setAmount("");
      setDisplayAmount("");
      setSelectedCategory("");
      setDescription("");
      setDate(dayjs().format("YYYY-MM-DD"));
      setTime(dayjs().format("HH:mm"));
      setCategorySearch("");

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
        <div className="flex items-center justify-between max-w-2xl mx-auto">
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

      <div className="px-6 py-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Transaction Type Toggle */}
          <div className="flex space-x-2 max-w-md mx-auto lg:max-w-full">
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
                type="text"
                inputMode="numeric"
                value={displayAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                className={`w-full p-4 pl-12 text-2xl font-semibold bg-gray-50 border-0 rounded-xl focus:ring-2 focus:outline-none transition-all ${
                  amount
                    ? "text-gray-800 focus:ring-teal-500"
                    : "text-gray-400 focus:ring-teal-500"
                }`}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-teal-600 pointer-events-none">
                {IDR_SYMBOL}
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[10000, 25000, 50000, 100000, 250000, 500000].map(
                (quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => handleAmountChange(quickAmount.toString())}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-teal-100 hover:text-teal-700 transition-colors"
                  >
                    {formatNumber(quickAmount)}
                  </button>
                )
              )}
            </div>

            {amount && (
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Amount: {formatIDR(parseFloat(amount))}
                </div>
                {parseFloat(amount) >= 1_000_000 && (
                  <div className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                    {parseFloat(amount) >= 1_000_000_000
                      ? `${(parseFloat(amount) / 1_000_000_000).toFixed(1)}B`
                      : `${(parseFloat(amount) / 1_000_000).toFixed(1)}M`}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            {/* Category Search */}
            {filteredCategories.length > 6 && (
              <div className="mb-4">
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full p-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-800"
                />
              </div>
            )}

            {/* Selected Category Display */}
            {selectedCategory && (
              <div className="mb-4 p-3 bg-teal-50 rounded-xl border border-teal-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {filteredCategories.find(
                      (cat) => cat.id === selectedCategory
                    ) && (
                      <>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-white shadow-sm">
                          <span>
                            {
                              filteredCategories.find(
                                (cat) => cat.id === selectedCategory
                              )?.icon
                            }
                          </span>
                        </div>
                        <span className="text-sm font-medium text-teal-700">
                          {
                            filteredCategories.find(
                              (cat) => cat.id === selectedCategory
                            )?.name
                          }
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("")}
                    className="text-teal-600 hover:text-teal-700 text-sm"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}

            {/* Category Grid */}
            {!selectedCategory && (
              <>
                {/* Quick Categories for common expenses */}
                {transactionType === "expense" && categorySearch === "" && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                      Most Common
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {filteredCategories
                        .filter((cat) =>
                          [
                            "Makanan & Minuman",
                            "Kopi & Jajan",
                            "Ojek Online",
                            "Belanja Groceries",
                            "Bensin & Parkir",
                            "Internet & Pulsa",
                          ].includes(cat.name)
                        )
                        .slice(0, 6)
                        .map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => setSelectedCategory(category.id)}
                            className="p-3 rounded-lg border-2 border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm"
                                style={{
                                  backgroundColor: category.color + "20",
                                }}
                              >
                                <span>{category.icon}</span>
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-xs font-medium text-gray-700">
                                  {category.name}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* All Categories */}
                <div>
                  {transactionType === "expense" && categorySearch === "" && (
                    <h4 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                      All Categories
                    </h4>
                  )}
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {filteredCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm"
                            style={{
                              backgroundColor: category.color + "20",
                            }}
                          >
                            <span>{category.icon}</span>
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-700">
                              {category.name}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* No categories message */}
            {filteredCategories.length === 0 && (
              <div className="space-y-4">
                {categorySearch ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">
                      No categories found for "{categorySearch}"
                    </p>
                    <button
                      type="button"
                      onClick={() => setCategorySearch("")}
                      className="text-xs mt-1 text-teal-600 hover:text-teal-700"
                    >
                      Clear search
                    </button>
                  </div>
                ) : categories.length === 0 ? (
                  <CreateDefaultCategories
                    onSuccess={() => {
                      // Reload categories after creation
                      if (user?.familyId) {
                        categoryService
                          .getAll(user.familyId)
                          .then(setCategories);
                      }
                    }}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">
                      No categories available for {transactionType}
                    </p>
                    <p className="text-xs mt-1">
                      Switch to{" "}
                      {transactionType === "expense" ? "income" : "expense"} or
                      create new categories
                    </p>
                  </div>
                )}
              </div>
            )}
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

          {/* Date and Time */}
          <div className="space-y-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-800"
              />
              <p className="mt-1 text-xs text-gray-500">
                Adding the correct time helps sort transactions properly
              </p>
            </div>
          </div>
        </div>

        {/* Save Button - Responsive positioning */}
        <div className="sticky bottom-0 lg:relative lg:bottom-auto lg:mt-8 p-6 bg-white border-t border-gray-100 lg:border-t-0">
          {/* Validation feedback */}
          {(!amount || !selectedCategory) && (
            <div className="mb-3 text-center">
              <p className="text-sm text-gray-500">
                {!amount && !selectedCategory
                  ? "Enter amount and select category"
                  : !amount
                  ? "Enter amount to continue"
                  : "Select a category to continue"}
              </p>
            </div>
          )}

          <div className="max-w-md mx-auto lg:max-w-sm">
            <button
              onClick={handleSave}
              disabled={!isFormValid || loading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                isFormValid && !loading
                  ? "bg-gray-800 hover:bg-gray-900 active:scale-95 shadow-lg"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                `Save ${transactionType === "expense" ? "Expense" : "Income"}`
              )}
            </button>
          </div>
        </div>

        {/* Add bottom padding for mobile only */}
        <div className="h-40 lg:h-0"></div>
      </div>
    </div>
  );
};
