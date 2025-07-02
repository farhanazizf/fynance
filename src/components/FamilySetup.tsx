import React, { useState } from "react";
import { Button, Input, Card, message, Space, Typography } from "antd";
import { UserAddOutlined, TeamOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface FamilySetupProps {
  onFamilySetup: (familyId: string) => void;
  userEmail: string;
}

export const FamilySetup: React.FC<FamilySetupProps> = ({
  onFamilySetup,
  userEmail,
}) => {
  const [familyId, setFamilyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [setupMode, setSetupMode] = useState<"choose" | "create" | "join">(
    "choose"
  );

  const handleCreateFamily = async () => {
    setIsLoading(true);
    try {
      // Generate a new family ID based on user email and timestamp
      const timestamp = Date.now();
      const emailPrefix = userEmail.split("@")[0].toLowerCase();
      const newFamilyId = `family-${emailPrefix}-${timestamp}`;

      message.success("Family created successfully!");
      onFamilySetup(newFamilyId);
    } catch (error) {
      console.error("Error creating family:", error);
      message.error("Failed to create family. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinFamily = async () => {
    if (!familyId.trim()) {
      message.error("Please enter a valid Family ID");
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you'd validate the family ID exists
      message.success("Successfully joined family!");
      onFamilySetup(familyId.trim());
    } catch (error) {
      console.error("Error joining family:", error);
      message.error(
        "Failed to join family. Please check the Family ID and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (setupMode === "choose") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TeamOutlined className="text-2xl text-white" />
            </div>
            <Title level={2} className="text-gray-800 mb-2">
              Family Setup
            </Title>
            <Text className="text-gray-600">
              Set up family sharing to track finances together
            </Text>
          </div>

          <Space direction="vertical" size="large" className="w-full">
            <Card
              hoverable
              onClick={() => setSetupMode("create")}
              className="cursor-pointer border-2 hover:border-blue-500 transition-colors"
            >
              <div className="text-center p-4">
                <PlusOutlined className="text-3xl text-blue-500 mb-3" />
                <Title level={4} className="mb-2">
                  Create New Family
                </Title>
                <Text className="text-gray-600">
                  Start a new family account for shared expense tracking
                </Text>
              </div>
            </Card>

            <Card
              hoverable
              onClick={() => setSetupMode("join")}
              className="cursor-pointer border-2 hover:border-green-500 transition-colors"
            >
              <div className="text-center p-4">
                <UserAddOutlined className="text-3xl text-green-500 mb-3" />
                <Title level={4} className="mb-2">
                  Join Existing Family
                </Title>
                <Text className="text-gray-600">
                  Join your family's existing expense tracking account
                </Text>
              </div>
            </Card>
          </Space>
        </div>
      </div>
    );
  }

  if (setupMode === "create") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusOutlined className="text-2xl text-white" />
              </div>
              <Title level={3} className="mb-2">
                Create New Family
              </Title>
              <Text className="text-gray-600">
                You'll be the admin of this family account
              </Text>
            </div>

            <Space direction="vertical" size="large" className="w-full">
              <div>
                <Text strong className="block mb-2">
                  Account Owner
                </Text>
                <Input value={userEmail} disabled />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <Text className="text-sm text-gray-600">
                  <strong>Note:</strong> After creating the family, you can
                  share the Family ID with your spouse or family members so they
                  can join and access the same financial data.
                </Text>
              </div>

              <Space className="w-full" size="middle">
                <Button
                  onClick={() => setSetupMode("choose")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  loading={isLoading}
                  onClick={handleCreateFamily}
                  className="flex-1"
                >
                  Create Family
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    );
  }

  if (setupMode === "join") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserAddOutlined className="text-2xl text-white" />
              </div>
              <Title level={3} className="mb-2">
                Join Existing Family
              </Title>
              <Text className="text-gray-600">
                Enter the Family ID shared by your family member
              </Text>
            </div>

            <Space direction="vertical" size="large" className="w-full">
              <div>
                <Text strong className="block mb-2">
                  Your Email
                </Text>
                <Input value={userEmail} disabled />
              </div>

              <div>
                <Text strong className="block mb-2">
                  Family ID *
                </Text>
                <Input
                  placeholder="Enter Family ID (e.g., family-john-1234567890)"
                  value={familyId}
                  onChange={(e) => setFamilyId(e.target.value)}
                  onPressEnter={handleJoinFamily}
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <Text className="text-sm text-gray-600">
                  <strong>Tip:</strong> Ask the family member who created the
                  account to share the Family ID with you. It usually starts
                  with "family-" followed by their name and numbers.
                </Text>
              </div>

              <Space className="w-full" size="middle">
                <Button
                  onClick={() => setSetupMode("choose")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  loading={isLoading}
                  onClick={handleJoinFamily}
                  disabled={!familyId.trim()}
                  className="flex-1"
                >
                  Join Family
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};
