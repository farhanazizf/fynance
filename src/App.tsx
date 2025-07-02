import React, { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { AddTransaction } from "./components/AddTransaction";
import { Reports } from "./components/Reports";
import { Categories } from "./components/Categories";
import { MobileLayout } from "./components/MobileLayout";
import { FamilySetup } from "./components/FamilySetup";

// App content component that uses auth context
const AppContent: React.FC = () => {
  const { user, loading, needsFamilySetup, setupFamily, firebaseUser } =
    useAuth();
  const [currentPage, setCurrentPage] = useState("home");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Check if user is authenticated but needs family setup
    if (firebaseUser && needsFamilySetup) {
      return (
        <FamilySetup
          onFamilySetup={setupFamily}
          userEmail={firebaseUser.email || ""}
        />
      );
    }
    return <Login />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return <Dashboard />;
      case "add":
        return <AddTransaction onBack={() => setCurrentPage("home")} />;
      case "reports":
        return <Reports onBack={() => setCurrentPage("home")} />;
      case "settings":
        return <Categories onBack={() => setCurrentPage("home")} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MobileLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderContent()}
    </MobileLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
