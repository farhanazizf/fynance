import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { transactionService, categoryService } from "../lib/firestore";
import type { Transaction, Category } from "../types";
import { formatIDR } from "../utils/currency";

interface ReportsProps {
  onBack: () => void;
}

interface DayData {
  day: string;
  amount: number;
  date: Date;
}

interface CategorySummary {
  name: string;
  percentage: number;
  amount: number;
  color: string;
  icon: string;
}

export const Reports: React.FC<ReportsProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("week");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<DayData[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySummary[]>([]);

  const timeframes = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
  ];

  // Get date range based on timeframe
  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate: Date;
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );

    switch (timeframe) {
      case "week": {
        // Start from Monday of current week
        const dayOfWeek = now.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + diff
        );
        break;
      }
      case "month": {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      }
      case "year": {
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      }
      default: {
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        );
      }
    }

    return { startDate, endDate };
  }, [timeframe]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!user?.familyId) return;

      try {
        setLoading(true);
        const { startDate, endDate } = getDateRange();

        const [transactionsData, categoriesData] = await Promise.all([
          transactionService.getByDateRange(user.familyId, startDate, endDate),
          categoryService.getAll(user.familyId),
        ]);

        setTransactions(transactionsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading reports data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.familyId, timeframe, getDateRange]);

  // Process chart data
  useEffect(() => {
    if (!transactions.length) {
      setChartData([]);
      return;
    }

    const { startDate } = getDateRange();
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );

    if (timeframe === "week") {
      // Generate 7 days from start date
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const data = days.map((day, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);

        const dayTransactions = expenseTransactions.filter(
          (t) => t.date.toDateString() === date.toDateString()
        );

        const amount = dayTransactions.reduce((sum, t) => sum + t.amount, 0);

        return { day, amount, date };
      });

      setChartData(data);
    } else if (timeframe === "month") {
      // Generate weeks in month
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
      const data = weeks.map((week, index) => {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + index * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const weekTransactions = expenseTransactions.filter(
          (t) => t.date >= weekStart && t.date <= weekEnd
        );

        const amount = weekTransactions.reduce((sum, t) => sum + t.amount, 0);

        return { day: week, amount, date: weekStart };
      });

      setChartData(data);
    } else {
      // Generate months in year
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const data = months.map((month, index) => {
        const monthStart = new Date(startDate.getFullYear(), index, 1);
        const monthEnd = new Date(startDate.getFullYear(), index + 1, 0);

        const monthTransactions = expenseTransactions.filter(
          (t) => t.date >= monthStart && t.date <= monthEnd
        );

        const amount = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

        return { day: month, amount, date: monthStart };
      });

      setChartData(data);
    }
  }, [transactions, timeframe, getDateRange]);

  // Process category data
  useEffect(() => {
    if (!transactions.length || !categories.length) {
      setCategoryData([]);
      return;
    }

    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );
    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    if (totalExpenses === 0) {
      setCategoryData([]);
      return;
    }

    // Group by category
    const categoryMap = new Map<string, number>();
    expenseTransactions.forEach((t) => {
      const current = categoryMap.get(t.categoryId) || 0;
      categoryMap.set(t.categoryId, current + t.amount);
    });

    // Create category summaries
    const summaries: CategorySummary[] = [];
    categoryMap.forEach((amount, categoryId) => {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        const percentage = Math.round((amount / totalExpenses) * 100);
        summaries.push({
          name: category.name,
          percentage,
          amount,
          color: category.color,
          icon: category.icon || category.name.charAt(0),
        });
      }
    });

    // Sort by amount and take top 5
    summaries.sort((a, b) => b.amount - a.amount);
    setCategoryData(summaries.slice(0, 5));
  }, [transactions, categories]);

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoadingOutlined className="text-3xl text-blue-500 mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

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
          {chartData.length > 0 ? (
            <div className="flex items-end space-x-2 h-48 mb-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-teal-500 rounded-t-md transition-all duration-500 ease-out"
                    style={{
                      height: `${(data.amount / maxAmount) * 100}%`,
                      minHeight: data.amount > 0 ? "8px" : "0px",
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 font-medium">
                    {data.day}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-500">No spending data for this period</p>
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top Categories
          </h3>
          {categoryData.length > 0 ? (
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-800">
                        {category.name}
                      </span>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {category.percentage}% of total
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatIDR(category.amount)}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: category.color,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No expense categories found</p>
              <p className="text-sm text-gray-400 mt-1">
                Add some transactions to see your spending breakdown
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
