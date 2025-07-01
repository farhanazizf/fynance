import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { formatIDR } from "../utils/currency";
import { createDefaultCategories } from "../utils/defaultCategories";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Create default categories on first load
  useEffect(() => {
    const initializeCategories = async () => {
      if (user?.familyId) {
        try {
          await createDefaultCategories(user.familyId);
        } catch (error) {
          console.error("Error creating default categories:", error);
        }
      }
    };

    initializeCategories();
  }, [user?.familyId]);

  // Mock data for now (in IDR)
  const currentBalance = 3_450_000; // 3.45 million IDR
  const monthlyBudget = {
    used: 1_400_000, // 1.4 million IDR
    total: 2_000_000, // 2 million IDR
  };

  const recentTransactions = [
    {
      id: 1,
      type: "income",
      category: "Salary",
      amount: 1_250_000,
      date: "Mar 12",
      icon: "💼",
    },
    {
      id: 2,
      type: "expense",
      category: "Grocery Store",
      amount: -50_490,
      date: "Mar 10",
      icon: "🛒",
    },
    {
      id: 3,
      type: "expense",
      category: "Rent",
      amount: -100_500,
      date: "Mar 5",
      icon: "🏠",
    },
  ];

  const budgetPercentage = Math.round(
    (monthlyBudget.used / monthlyBudget.total) * 100
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hi, {user?.displayName?.split(" ")[0] || "Alex"}!
            </h1>
            <p className="text-sm text-gray-500 mt-1">March, 2025</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full overflow-hidden flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
              {(
                user?.displayName?.charAt(0) ||
                user?.email?.charAt(0) ||
                "A"
              ).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8">
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
            <span className="text-xl font-bold">%{budgetPercentage}</span>
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
