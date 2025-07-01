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
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Hi, {user?.displayName?.split(" ")[0] || "Alex"}!
            </h1>
            <p className="text-sm text-gray-500">March, 2025</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            <img
              src="https://via.placeholder.com/40x40/4F46E5/ffffff?text=A"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Current Balance */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Current Balance</p>
          <h2 className="text-3xl font-bold text-gray-800">
            ${currentBalance.toLocaleString()}.00
          </h2>
        </div>

        {/* Monthly Budget Card */}
        <div className="bg-teal-500 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Monthly Budget</h3>
          <div className="mb-3">
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${budgetPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">
              {formatIDR(monthlyBudget.used)} / {formatIDR(monthlyBudget.total)}
            </span>
            <span className="text-sm font-semibold">%{budgetPercentage}</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg">
                    {transaction.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {transaction.category}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <span
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : ""}
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
