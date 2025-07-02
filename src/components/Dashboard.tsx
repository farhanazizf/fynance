import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { formatIDR } from "../utils/currency";
import { createDefaultCategories } from "../utils/defaultCategories";
import { transactionService, categoryService } from "../lib/firestore";
import { Transaction, Category } from "../types";
import { message, Button } from "antd";
import {
  cleanupDuplicateCategories,
  getCategorySummary,
} from "../utils/categoryCleanup";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState({
    used: 0,
    total: 2_000_000, // Default budget - can be made configurable later
  });
  const [showCleanupButton, setShowCleanupButton] = useState(false);

  // Manual cleanup function
  const handleManualCleanup = async () => {
    if (!user?.familyId) return;

    try {
      const summary = await getCategorySummary(user.familyId);
      if (summary.duplicates > 0) {
        await cleanupDuplicateCategories(user.familyId);
        message.success(
          `Cleaned up ${summary.duplicates} duplicate categories!`
        );

        // Reload categories
        const newCategories = await categoryService.getAll(user.familyId);
        setCategories(newCategories);
        setShowCleanupButton(false);
      } else {
        message.info("No duplicate categories found!");
      }
    } catch (error) {
      console.error("Error during manual cleanup:", error);
      message.error("Failed to clean up categories");
    }
  };

  // Check for duplicates
  const checkForDuplicates = async () => {
    if (!user?.familyId) return;

    try {
      const summary = await getCategorySummary(user.familyId);
      setShowCleanupButton(summary.duplicates > 0);
    } catch (error) {
      console.error("Error checking for duplicates:", error);
    }
  };

  // Create default categories and load data on first load
  useEffect(() => {
    const initializeData = async () => {
      if (!user?.familyId) {
        console.error("No family ID found for user");
        message.error("User account setup incomplete. Please contact support.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Clean up any duplicate categories first
        await cleanupDuplicateCategories(user.familyId);

        // Ensure default categories exist
        const existingCategories = await categoryService.getAll(user.familyId);
        setCategories(existingCategories);

        if (existingCategories.length === 0) {
          await createDefaultCategories(user.familyId);
          const newCategories = await categoryService.getAll(user.familyId);
          setCategories(newCategories);
        }

        // Get current month's transactions
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Get all transactions
        const allTxns = await transactionService.getAll(user.familyId);
        setTransactions(allTxns);

        // Calculate current balance
        const balance = allTxns.reduce((sum, txn) => {
          return sum + (txn.type === "income" ? txn.amount : -txn.amount);
        }, 0);
        setCurrentBalance(balance);

        // Calculate monthly expenses
        const monthlyTxns = allTxns.filter(
          (txn) => txn.date >= startOfMonth && txn.date <= endOfMonth
        );

        const monthlyExpenses = monthlyTxns
          .filter((txn) => txn.type === "expense")
          .reduce((sum, txn) => sum + txn.amount, 0);

        setMonthlyBudget((prev) => ({
          ...prev,
          used: monthlyExpenses,
        }));

        // Check for any remaining duplicates
        await checkForDuplicates();
      } catch (error) {
        console.error("Error loading data:", error);
        message.error(
          "Failed to load your financial data. Please check your connection or permissions."
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [user?.familyId]);

  // Calculate budget percentage
  const budgetPercentage = Math.round(
    Math.min((monthlyBudget.used / monthlyBudget.total) * 100, 100)
  );

  // Get recent transactions with category details
  const recentTransactions = transactions.slice(0, 3).map((txn) => {
    const category = categories.find((cat) => cat.id === txn.categoryId);
    return {
      id: txn.id,
      type: txn.type,
      category: category?.name || "Other",
      amount: txn.type === "income" ? txn.amount : -txn.amount,
      date: txn.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      icon: category?.icon || (txn.type === "income" ? "💰" : "💸"),
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hi,{" "}
            {user?.displayName?.split(" ")[0] ||
              user?.email?.split("@")[0] ||
              "User"}
            !
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* Cleanup Button - Show only if duplicates found */}
        {showCleanupButton && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Duplicate Categories Detected
                </h4>
                <p className="text-xs text-yellow-700 mt-1">
                  We found duplicate categories in your account. Clean them up
                  for better organization.
                </p>
              </div>
              <Button
                type="primary"
                size="small"
                onClick={handleManualCleanup}
                className="bg-yellow-600 hover:bg-yellow-700 border-yellow-600"
              >
                Clean Up
              </Button>
            </div>
          </div>
        )}

        {/* Current Balance */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Current Balance</p>
          <h2 className="text-4xl font-bold text-gray-900">
            {formatIDR(currentBalance)}
          </h2>
        </div>

        {/* Monthly Budget Card */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
          <h3 className="text-xl font-bold mb-6">Monthly Budget</h3>
          <div className="mb-4">
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${budgetPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/90 font-medium">
              {formatIDR(monthlyBudget.used)} / {formatIDR(monthlyBudget.total)}
            </span>
            <span className="text-xl font-bold">{budgetPercentage}%</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="pb-24">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">
                    {transaction.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-base">
                      {transaction.category}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <span
                  className={`font-bold text-lg ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatIDR(Math.abs(transaction.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
