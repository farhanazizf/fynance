import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, message, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { isDemoMode } from "../lib/demo-auth";

const { Title, Text } = Typography;

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success("Login successful!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-blue-600 mb-2">💰</div>
          <Title level={2} className="mb-2">
            FYnance
          </Title>
          <Text type="secondary">Family Cashflow Tracker</Text>
        </div>

        {isDemoMode && (
          <Alert
            message="Demo Mode"
            description="Use demo@fynance.com / demo123 or admin@fynance.com / admin123"
            type="info"
            showIcon
            className="mb-4"
          />
        )}

        <Form name="login" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 text-base font-medium"
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm text-gray-500">
          <div className="font-medium mb-1">Family Cashflow Tracker</div>
          <div className="text-xs">
            Create accounts for you and your spouse to share financial data
          </div>
        </div>
      </Card>
    </div>
  );
};
