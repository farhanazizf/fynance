import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Radio,
  InputNumber,
  Typography,
  message,
  Row,
  Col,
  Tag,
  Divider,
  Alert,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { categoryService, transactionService } from "../lib/firestore";
import type { Category, Transaction } from "../types";
import { parseIDR, MAX_AMOUNT } from "../utils/currency";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const AddTransaction: React.FC = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      if (!user?.familyId) return;

      try {
        const familyCategories = await categoryService.getAll(user.familyId);
        setCategories(familyCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
        message.error("Gagal memuat kategori");
      }
    };

    loadCategories();
  }, [user?.familyId]);

  // Filter categories based on transaction type
  useEffect(() => {
    const filtered = categories.filter((cat) => cat.type === transactionType);
    setFilteredCategories(filtered);

    // Reset category selection when type changes
    form.setFieldValue("categoryId", undefined);
  }, [transactionType, categories, form]);

  const handleTypeChange = (type: "income" | "expense") => {
    setTransactionType(type);
  };

  const onFinish = async (values: {
    amount: number;
    type: "income" | "expense";
    categoryId: string;
    description: string;
    date: dayjs.Dayjs;
  }) => {
    if (!user?.familyId) {
      message.error("User belum terautentikasi dengan benar");
      return;
    }

    setLoading(true);
    try {
      const transaction: Omit<Transaction, "id" | "createdAt" | "familyId"> = {
        amount: values.amount,
        type: values.type,
        categoryId: values.categoryId,
        description: values.description,
        date: values.date.toDate(),
        addedBy: user.uid,
      };

      await transactionService.create(user.familyId, transaction);

      message.success(
        `${
          values.type === "income" ? "Pemasukan" : "Pengeluaran"
        } berhasil ditambahkan!`
      );
      form.resetFields();
      form.setFieldValue("date", dayjs()); // Reset to today
    } catch (error) {
      console.error("Error adding transaction:", error);
      message.error("Gagal menambahkan transaksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
      {/* Header - Mobile Optimized */}
      <div className="mb-6 sm:mb-8">
        <Title
          level={2}
          className="mb-2 text-xl sm:text-2xl lg:text-3xl text-gray-800"
        >
          <PlusOutlined className="mr-2 sm:mr-3" />
          Tambah Transaksi
        </Title>
        <Text type="secondary" className="text-sm sm:text-base">
          Catat pemasukan dan pengeluaran keluarga Anda
        </Text>
      </div>

      <Row gutter={[16, 16]} className="lg:gutter-24">
        {/* Main Form */}
        <Col xs={24} lg={14} xl={15}>
          <Card
            className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
            bodyStyle={{ padding: "20px 24px" }}
          >
            {/* Transaction Type Selector - Mobile Optimized */}
            <div className="mb-6 sm:mb-8">
              <Title
                level={4}
                className="mb-3 sm:mb-4 text-base sm:text-lg text-gray-700"
              >
                Jenis Transaksi
              </Title>
              <Radio.Group
                value={transactionType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full"
                size="large"
              >
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Radio.Button
                    value="expense"
                    className="h-14 sm:h-16 flex items-center justify-center text-center border-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor:
                        transactionType === "expense" ? "#fee2e2" : "#ffffff",
                      borderColor:
                        transactionType === "expense" ? "#dc2626" : "#d1d5db",
                      color: "#dc2626",
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <ArrowDownOutlined className="text-lg sm:text-xl mb-1" />
                      <span className="font-medium text-sm sm:text-base">
                        Pengeluaran
                      </span>
                    </div>
                  </Radio.Button>
                  <Radio.Button
                    value="income"
                    className="h-14 sm:h-16 flex items-center justify-center text-center border-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor:
                        transactionType === "income" ? "#dcfce7" : "#ffffff",
                      borderColor:
                        transactionType === "income" ? "#16a34a" : "#d1d5db",
                      color: "#16a34a",
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <ArrowUpOutlined className="text-lg sm:text-xl mb-1" />
                      <span className="font-medium text-sm sm:text-base">
                        Pemasukan
                      </span>
                    </div>
                  </Radio.Button>
                </div>
              </Radio.Group>
            </div>

            <Divider className="my-6" />

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                type: "expense",
                date: dayjs(),
              }}
              size="large"
            >
              <Form.Item name="type" hidden>
                <Input />
              </Form.Item>

              {/* Amount and Date Row - Mobile Optimized */}
              <Row gutter={[12, 16]} className="sm:gutter-16">
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="amount"
                    label={
                      <span className="text-sm sm:text-base font-medium text-gray-700">
                        Jumlah (IDR)
                      </span>
                    }
                    rules={[
                      { required: true, message: "Masukkan jumlah!" },
                      {
                        type: "number",
                        min: 1,
                        message: "Jumlah minimal Rp 1!",
                      },
                      {
                        type: "number",
                        max: MAX_AMOUNT,
                        message: `Jumlah maksimal Rp ${MAX_AMOUNT.toLocaleString(
                          "id-ID"
                        )}!`,
                      },
                    ]}
                  >
                    <InputNumber
                      prefix={
                        <span className="text-gray-500 text-sm sm:text-base">
                          Rp
                        </span>
                      }
                      placeholder="0"
                      className="w-full h-11 sm:h-12"
                      precision={0}
                      min={0}
                      max={MAX_AMOUNT}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                      }
                      parser={(value) => {
                        const parsed = parseIDR(value || "0");
                        return Math.min(
                          Math.max(parsed, 0),
                          MAX_AMOUNT
                        ) as typeof MAX_AMOUNT;
                      }}
                      style={{
                        fontSize: "clamp(14px, 2.5vw, 16px)",
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="date"
                    label={
                      <span className="text-sm sm:text-base font-medium text-gray-700">
                        Tanggal
                      </span>
                    }
                    rules={[{ required: true, message: "Pilih tanggal!" }]}
                  >
                    <DatePicker
                      className="w-full h-11 sm:h-12"
                      format="DD/MM/YYYY"
                      placeholder="Pilih tanggal"
                      style={{
                        fontSize: "clamp(14px, 2.5vw, 16px)",
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Category */}
              <Form.Item
                name="categoryId"
                label={
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    Kategori{" "}
                    {transactionType === "income" ? "Pemasukan" : "Pengeluaran"}
                  </span>
                }
                rules={[{ required: true, message: "Pilih kategori!" }]}
              >
                <Select
                  placeholder={`Pilih kategori ${
                    transactionType === "income" ? "pemasukan" : "pengeluaran"
                  }`}
                  className="h-11 sm:h-12"
                  showSearch
                  optionLabelProp="label"
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                  }}
                >
                  {filteredCategories.map((category) => (
                    <Select.Option
                      key={category.id}
                      value={category.id}
                      label={category.name}
                    >
                      <div className="flex items-center py-1">
                        <span className="text-base sm:text-lg mr-2 sm:mr-3">
                          {category.icon}
                        </span>
                        <span className="flex-1 text-sm sm:text-base">
                          {category.name}
                        </span>
                        <Tag color={category.color} className="ml-2 text-xs">
                          {category.type === "income" ? "Masuk" : "Keluar"}
                        </Tag>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Description */}
              <Form.Item
                name="description"
                label={
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    Keterangan
                  </span>
                }
                rules={[
                  { required: true, message: "Masukkan keterangan!" },
                  {
                    min: 3,
                    message: "Keterangan minimal 3 karakter!",
                  },
                ]}
              >
                <TextArea
                  placeholder="Masukkan keterangan transaksi (contoh: Makan siang di restoran, Gaji bulanan, Belanja groceries)"
                  rows={3}
                  maxLength={200}
                  showCount
                  className="text-sm sm:text-base"
                />
              </Form.Item>

              {/* Submit Buttons - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                  className="flex-1 h-11 sm:h-12 text-sm sm:text-base font-medium order-1"
                  style={{
                    backgroundColor:
                      transactionType === "income" ? "#16a34a" : "#dc2626",
                    borderColor:
                      transactionType === "income" ? "#16a34a" : "#dc2626",
                  }}
                >
                  Tambah{" "}
                  {transactionType === "income" ? "Pemasukan" : "Pengeluaran"}
                </Button>
                <Button
                  onClick={() => form.resetFields()}
                  size="large"
                  className="h-11 sm:h-12 px-6 sm:px-8 order-2 sm:order-2 text-sm sm:text-base"
                >
                  Bersihkan
                </Button>
              </div>
            </Form>
          </Card>
        </Col>

        {/* Sidebar - Mobile Optimized */}
        <Col xs={24} lg={10} xl={9}>
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Categories */}
            <Card
              title={
                <span className="text-base sm:text-lg font-medium">
                  Kategori Cepat
                </span>
              }
              className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
              bodyStyle={{ padding: "16px 20px" }}
            >
              <div className="space-y-1">
                <Text
                  type="secondary"
                  className="text-xs sm:text-sm block mb-3 sm:mb-4"
                >
                  Kategori{" "}
                  {transactionType === "income" ? "Pemasukan" : "Pengeluaran"}
                </Text>

                {filteredCategories.length > 0 ? (
                  <div className="space-y-2">
                    {filteredCategories.slice(0, 6).map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center p-2 sm:p-3 rounded-lg cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-200 active:bg-gray-100"
                        onClick={() => {
                          form.setFieldValue("categoryId", category.id);
                          message.success(`Dipilih: ${category.name}`);
                        }}
                      >
                        <span className="text-lg sm:text-xl mr-2 sm:mr-3">
                          {category.icon}
                        </span>
                        <Text className="flex-1 font-medium text-sm sm:text-base">
                          {category.name}
                        </Text>
                        <div
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert
                    message="Kategori Tidak Ditemukan"
                    description={`Tidak ada kategori ${
                      transactionType === "income" ? "pemasukan" : "pengeluaran"
                    } tersedia. Tambahkan kategori di bagian Kategori.`}
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                    className="text-sm"
                  />
                )}
              </div>
            </Card>

            {/* Quick Tips */}
            <Card
              title={
                <span className="text-base sm:text-lg font-medium">
                  💡 Tips Cepat
                </span>
              }
              className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
              bodyStyle={{ padding: "16px 20px" }}
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-blue-500 mt-1 text-base sm:text-lg">
                    📝
                  </span>
                  <div>
                    <Text strong className="block text-sm sm:text-base">
                      Detail Transaksi
                    </Text>
                    <Text type="secondary" className="text-xs sm:text-sm">
                      Tambahkan detail spesifik untuk tracking yang lebih baik
                    </Text>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-green-500 mt-1 text-base sm:text-lg">
                    👨‍👩‍👧‍👦
                  </span>
                  <div>
                    <Text strong className="block text-sm sm:text-base">
                      Sharing Keluarga
                    </Text>
                    <Text type="secondary" className="text-xs sm:text-sm">
                      Suami istri dapat menambah transaksi ke akun bersama
                    </Text>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-purple-500 mt-1 text-base sm:text-lg">
                    📊
                  </span>
                  <div>
                    <Text strong className="block text-sm sm:text-base">
                      Kategori Konsisten
                    </Text>
                    <Text type="secondary" className="text-xs sm:text-sm">
                      Gunakan kategori yang sama untuk insight laporan yang
                      lebih baik
                    </Text>
                  </div>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-orange-500 mt-1 text-base sm:text-lg">
                    📅
                  </span>
                  <div>
                    <Text strong className="block text-sm sm:text-base">
                      Transaksi Mundur
                    </Text>
                    <Text type="secondary" className="text-xs sm:text-sm">
                      Anda dapat menambah transaksi masa lalu dengan mengubah
                      tanggal
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};
