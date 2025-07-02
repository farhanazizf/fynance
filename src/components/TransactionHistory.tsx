import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { formatIDR } from "../utils/currency";
import { formatAddedBy, getEmailDisplay } from "../utils/userDisplay";
import { format } from "date-fns";
import { transactionService, categoryService } from "../lib/firestore";
import { Transaction, Category } from "../types";
import { Input, Select, DatePicker, Empty, Button } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TransactionHistoryProps {
  onBack?: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  onBack,
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );

  useEffect(() => {
    const loadData = async () => {
      if (!user?.familyId) return;

      setIsLoading(true);
      try {
        const [allTransactions, allCategories] = await Promise.all([
          transactionService.getAll(user.familyId),
          categoryService.getAll(user.familyId),
        ]);

        // Sort transactions by date (most recent first)
        const sortedTransactions = [...allTransactions].sort(
          (a, b) => b.date.getTime() - a.date.getTime()
        );

        setTransactions(sortedTransactions);
        setCategories(allCategories);
        setFilteredTransactions(sortedTransactions);
      } catch (error) {
        console.error("Error loading transaction history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.familyId]);

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((txn) => {
        const category = categories.find((cat) => cat.id === txn.categoryId);
        return (
          category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (txn.addedBy || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((txn) => txn.type === selectedType);
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((txn) => txn.categoryId === selectedCategory);
    }

    // Date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].toDate();
      const endDate = dateRange[1].toDate();
      endDate.setHours(23, 59, 59, 999); // End of day

      filtered = filtered.filter((txn) => {
        return txn.date >= startDate && txn.date <= endDate;
      });
    }

    setFilteredTransactions(filtered);
  }, [
    transactions,
    categories,
    searchTerm,
    selectedType,
    selectedCategory,
    dateRange,
  ]);

  // Get transaction with category info
  const getTransactionWithCategory = (txn: Transaction) => {
    const category = categories.find((cat) => cat.id === txn.categoryId);

    // Format the email display for better mobile appearance
    const formatEmail = (email?: string) => {
      if (!email) return "[Unknown]";
      return getEmailDisplay(email);
    };

    return {
      ...txn,
      categoryName: category?.name || "Other",
      categoryIcon: category?.icon || (txn.type === "income" ? "💰" : "💸"),
      email: formatEmail(txn.addedBy),
    };
  };

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, txn) => {
    const dateKey = txn.date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(getTransactionWithCategory(txn));
    return groups;
  }, {} as Record<string, ReturnType<typeof getTransactionWithCategory>[]>);

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((txn) => txn.type === "income")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalExpense = filteredTransactions
    .filter((txn) => txn.type === "expense")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCategory("all");
    setDateRange(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center space-x-4 mb-6">
          {onBack && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className="p-0 h-auto"
            />
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            Transaction History
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-sm font-bold text-gray-900">
              {filteredTransactions.length}
            </p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-green-600 mb-1">Income</p>
            <p className="text-sm font-bold text-green-600">
              {formatIDR(totalIncome)}
            </p>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-red-500 mb-1">Expense</p>
            <p className="text-sm font-bold text-red-500">
              {formatIDR(totalExpense)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Search */}
          <Input
            placeholder="Search transactions..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-2xl"
            size="large"
          />

          {/* Filter Row */}
          <div className="flex space-x-3">
            <Select
              value={selectedType}
              onChange={setSelectedType}
              className="flex-1"
              size="large"
            >
              <Option value="all">All Types</Option>
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>

            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="flex-1"
              size="large"
              placeholder="Category"
            >
              <Option value="all">All Categories</Option>
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Date Range */}
          <RangePicker
            value={dateRange}
            onChange={(dates) =>
              setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)
            }
            className="w-full rounded-2xl"
            size="large"
            placeholder={["Start Date", "End Date"]}
          />

          {/* Clear Filters */}
          {(searchTerm ||
            selectedType !== "all" ||
            selectedCategory !== "all" ||
            dateRange) && (
            <Button
              type="link"
              onClick={clearFilters}
              icon={<FilterOutlined />}
              className="p-0 h-auto text-blue-500"
            >
              Clear all filters
            </Button>
          )}
        </div>

        {/* Transaction List */}
        <div className="pb-24">
          {Object.keys(groupedTransactions).length === 0 ? (
            <Empty description="No transactions found" className="mt-12" />
          ) : (
            Object.entries(groupedTransactions).map(
              ([date, dayTransactions]) => (
                <div key={date} className="mb-8">
                  {/* Date Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {date}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {dayTransactions.length} transaction
                      {dayTransactions.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="space-y-3">
                    {dayTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">
                            {transaction.categoryIcon}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-base">
                              {transaction.categoryName}
                            </p>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-gray-500">
                                {format(transaction.date, "h:mm a")}
                              </p>
                              <span className="text-gray-300">•</span>
                              <p className="text-xs text-gray-400">
                                by {formatAddedBy(transaction.addedBy)}
                              </p>
                            </div>
                            {transaction.description && (
                              <p className="text-xs text-gray-400 mt-1">
                                {transaction.description}
                              </p>
                            )}
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
                          {formatIDR(transaction.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};
