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

  const budgetPercentage = Math.round((monthlyBudget.used / monthlyBudget.total) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Hi, {user?.displayName?.split(' ')[0] || 'Alex'}!
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
                  <Statistic
                    value={stats.netCashflow}
                    precision={0}
                    valueStyle={{
                      color: "#ffffff",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                    formatter={(value) =>
                      `Rp ${formatIDR(Number(value), { showSymbol: false })}`
                    }
                  />
                </Card>
              </Badge.Ribbon>

              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                <CalendarOutlined className="text-blue-200" />
                <Text className="text-blue-100 text-sm">
                  Data hingga{" "}
                  {new Date().toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                  })}
                </Text>
              </div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </Card>
      </div>

      {/* Enhanced Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50"
            bodyStyle={{ padding: "20px" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <ArrowUpOutlined className="text-green-600 text-xl" />
              </div>
              <Progress
                type="circle"
                size={40}
                percent={75}
                strokeColor="#16a34a"
                showInfo={false}
              />
            </div>
            <Statistic
              title={
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <WalletOutlined className="mr-1" />
                  Total Pemasukan
                </span>
              }
              value={stats.totalIncome}
              precision={0}
              valueStyle={{
                color: "#16a34a",
                fontSize: "20px",
                fontWeight: "700",
              }}
              formatter={(value) =>
                `Rp ${formatIDR(Number(value), { showSymbol: false })}`
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-red-50 to-rose-50"
            bodyStyle={{ padding: "20px" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-red-100 rounded-xl">
                <ArrowDownOutlined className="text-red-600 text-xl" />
              </div>
              <Progress
                type="circle"
                size={40}
                percent={64}
                strokeColor="#dc2626"
                showInfo={false}
              />
            </div>
            <Statistic
              title={
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <WalletOutlined className="mr-1" />
                  Total Pengeluaran
                </span>
              }
              value={stats.totalExpenses}
              precision={0}
              valueStyle={{
                color: "#dc2626",
                fontSize: "20px",
                fontWeight: "700",
              }}
              formatter={(value) =>
                `Rp ${formatIDR(Number(value), { showSymbol: false })}`
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-cyan-50"
            bodyStyle={{ padding: "20px" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarOutlined className="text-blue-600 text-xl" />
              </div>
              <Badge count="NET" color="blue" />
            </div>
            <Statistic
              title={
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <LineChartOutlined className="mr-1" />
                  Cashflow Bersih
                </span>
              }
              value={stats.netCashflow}
              precision={0}
              valueStyle={{
                color: stats.netCashflow >= 0 ? "#16a34a" : "#dc2626",
                fontSize: "20px",
                fontWeight: "700",
              }}
              formatter={(value) =>
                `Rp ${formatIDR(Number(value), { showSymbol: false })}`
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-indigo-50"
            bodyStyle={{ padding: "20px" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <CalendarOutlined className="text-purple-600 text-xl" />
              </div>
              <Badge count="NEW" color="purple" />
            </div>
            <Statistic
              title={
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <CalendarOutlined className="mr-1" />
                  Bulan Ini
                </span>
              }
              value={stats.thisMonth.income - stats.thisMonth.expenses}
              precision={0}
              valueStyle={{
                color: "#7c3aed",
                fontSize: "20px",
                fontWeight: "700",
              }}
              formatter={(value) =>
                `Rp ${formatIDR(Number(value), { showSymbol: false })}`
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Enhanced Content Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <LineChartOutlined className="text-blue-600" />
                  </div>
                  Transaksi Terbaru
                </span>
                <Button type="link" size="small">
                  Lihat Semua
                </Button>
              </div>
            }
            className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            bodyStyle={{ minHeight: "300px" }}
          >
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <Title level={4} className="!mb-2 text-gray-600">
                Belum ada transaksi
              </Title>
              <Text type="secondary" className="text-sm mb-4 max-w-xs">
                Mulai dengan menambahkan transaksi keluarga pertama untuk
                melihat ringkasan keuangan!
              </Text>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-md hover:shadow-lg"
              >
                Tambah Transaksi Pertama
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <LineChartOutlined className="text-green-600" />
                  </div>
                  Kategori Pengeluaran
                </span>
                <Button type="link" size="small">
                  Kelola Kategori
                </Button>
              </div>
            }
            className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            bodyStyle={{ minHeight: "300px" }}
          >
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <Title level={4} className="!mb-2 text-gray-600">
                Grafik akan muncul di sini
              </Title>
              <Text type="secondary" className="text-sm mb-2 max-w-xs">
                Setelah Anda memiliki data transaksi, grafik kategori akan
                ditampilkan
              </Text>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <Avatar size="small" className="bg-blue-500">
                  A
                </Avatar>
                <Text type="secondary" className="text-xs">
                  Anda dan pasangan dapat menambahkan transaksi
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
