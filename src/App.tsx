import React, { useState, Suspense, lazy, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { MobileLayout } from "./components/MobileLayout";
import { usePerformanceMonitoring } from "./utils/performance";

// Lazy load ALL components for maximum code splitting
const Login = lazy(() =>
  import("./components/Login").then((module) => ({ default: module.Login }))
);
const FamilySetup = lazy(() =>
  import("./components/FamilySetup").then((module) => ({
    default: module.FamilySetup,
  }))
);
const Dashboard = lazy(() =>
  import("./components/Dashboard").then((module) => ({
    default: module.Dashboard,
  }))
);
const AddTransaction = lazy(() =>
  import("./components/AddTransaction").then((module) => ({
    default: module.AddTransaction,
  }))
);
const Reports = lazy(() =>
  import("./components/Reports").then((module) => ({ default: module.Reports }))
);
const Categories = lazy(() =>
  import("./components/Categories").then((module) => ({
    default: module.Categories,
  }))
);
const TransactionHistory = lazy(() =>
  import("./components/TransactionHistory").then((module) => ({
    default: module.TransactionHistory,
  }))
);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                Please refresh the page to try again
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Enhanced loading component with skeleton UI
const PageLoader: React.FC<{ page?: string }> = ({ page }) => {
  const getDashboardSkeleton = () => (
    <div className="p-4 space-y-6">
      {/* Header skeleton */}
      <div
        className="flex items-center justify-between opacity-0 animate-pulse"
        style={{ animation: "fadeInUp 0.6s ease-out forwards" }}
      >
        <div>
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mt-2"></div>
        </div>
        <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm border opacity-0"
            style={{
              animation: `fadeInUp 0.6s ease-out ${i * 0.1}s forwards`,
              background:
                "linear-gradient(110deg, #f3f4f6 8%, #e5e7eb 18%, #f3f4f6 33%)",
              backgroundSize: "200% 100%",
              animationName: "fadeInUp, shimmer",
              animationDuration: "0.6s, 1.5s",
              animationIterationCount: "1, infinite",
              animationDelay: `${i * 0.1}s, 0s`,
            }}
          >
            <div className="h-4 bg-gray-200/50 rounded w-20"></div>
            <div className="h-8 bg-gray-200/50 rounded w-24 mt-2"></div>
          </div>
        ))}
      </div>

      {/* Recent transactions skeleton */}
      <div
        className="bg-white rounded-xl shadow-sm border p-4 opacity-0"
        style={{ animation: "fadeInUp 0.6s ease-out 0.3s forwards" }}
      >
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg opacity-0"
              style={{
                animation: `fadeInUp 0.6s ease-out ${(i + 3) * 0.1}s forwards`,
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mt-1"></div>
                </div>
              </div>
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `,
        }}
      />
    </div>
  );

  const getReportsSkeleton = () => (
    <div className="p-4 space-y-6">
      {/* Header skeleton */}
      <div
        className="flex items-center justify-between opacity-0"
        style={{ animation: "fadeInUp 0.6s ease-out forwards" }}
      >
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
        <div className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
      </div>

      {/* Chart skeleton */}
      <div
        className="bg-white rounded-xl shadow-sm border p-6 opacity-0"
        style={{ animation: "fadeInUp 0.6s ease-out 0.1s forwards" }}
      >
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 mb-4"></div>
        <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border p-4 opacity-0"
            style={{
              animation: `fadeInUp 0.6s ease-out ${0.2 + i * 0.1}s forwards`,
            }}
          >
            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mb-3"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between items-center">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getAddTransactionSkeleton = () => (
    <div className="p-4 space-y-6">
      {/* Header skeleton */}
      <div
        className="flex items-center justify-between opacity-0"
        style={{ animation: "fadeInUp 0.6s ease-out forwards" }}
      >
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40"></div>
        <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
      </div>

      {/* Form skeleton */}
      <div className="space-y-4">
        {/* Amount input */}
        <div
          className="opacity-0"
          style={{ animation: "fadeInUp 0.6s ease-out 0.1s forwards" }}
        >
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mb-2"></div>
          <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Description input */}
        <div
          className="opacity-0"
          style={{ animation: "fadeInUp 0.6s ease-out 0.2s forwards" }}
        >
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 mb-2"></div>
          <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Category selector */}
        <div
          className="opacity-0"
          style={{ animation: "fadeInUp 0.6s ease-out 0.3s forwards" }}
        >
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-18 mb-2"></div>
          <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Type selector */}
        <div
          className="opacity-0"
          style={{ animation: "fadeInUp 0.6s ease-out 0.4s forwards" }}
        >
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 mb-2"></div>
          <div className="flex gap-2">
            <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded flex-1 animate-pulse"></div>
            <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded flex-1 animate-pulse"></div>
          </div>
        </div>

        {/* Date picker */}
        <div
          className="opacity-0"
          style={{ animation: "fadeInUp 0.6s ease-out 0.5s forwards" }}
        >
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 mb-2"></div>
          <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Save button */}
        <div
          className="opacity-0"
          style={{ animation: "fadeInUp 0.6s ease-out 0.6s forwards" }}
        >
          <div className="h-12 bg-gradient-to-r from-blue-200 to-blue-300 rounded mt-8 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const getCategoriesSkeleton = () => (
    <div className="p-4 space-y-6">
      {/* Header skeleton */}
      <div
        className="flex items-center justify-between opacity-0"
        style={{ animation: "fadeInUp 0.6s ease-out forwards" }}
      >
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
        <div className="h-10 w-20 bg-gradient-to-r from-blue-200 to-blue-300 rounded"></div>
      </div>

      {/* Categories list skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-white rounded-lg border opacity-0"
            style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s forwards` }}
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              <div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mt-1"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              <div className="h-8 w-8 bg-gradient-to-r from-red-200 to-red-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getSkeletonByPage = () => {
    switch (page) {
      case "Dashboard":
        return getDashboardSkeleton();
      case "Reports":
        return getReportsSkeleton();
      case "Add Transaction":
        return getAddTransactionSkeleton();
      case "Categories":
        return getCategoriesSkeleton();
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {page ? `Loading ${page}...` : "Loading..."}
              </p>
            </div>
          </div>
        );
    }
  };

  return <div className="min-h-screen bg-gray-50">{getSkeletonByPage()}</div>;
};

// Authentication loading component
const AuthLoader: React.FC<{ stage?: string }> = ({ stage = "auth" }) => {
  const getLoadingMessage = () => {
    switch (stage) {
      case "auth":
        return "Authenticating...";
      case "data":
        return "Loading your data...";
      case "ui":
        return "Preparing interface...";
      default:
        return "Initializing your workspace...";
    }
  };

  const getProgressWidth = () => {
    switch (stage) {
      case "auth":
        return "33%";
      case "data":
        return "66%";
      case "ui":
        return "90%";
      default:
        return "10%";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full mx-4">
        {/* App logo skeleton */}
        <div className="mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center">
            <div className="h-8 w-8 bg-white rounded animate-pulse"></div>
          </div>
        </div>

        {/* App name skeleton */}
        <div className="h-8 bg-gray-200 rounded w-32 mx-auto animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse mb-6"></div>

        {/* Loading spinner */}
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <p className="text-sm text-gray-600">{getLoadingMessage()}</p>

        {/* Progress bar skeleton */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: getProgressWidth() }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Preload function to load components in background
const preloadComponent = (componentName: string) => {
  switch (componentName) {
    case "add":
      import("./components/AddTransaction");
      break;
    case "reports":
      import("./components/Reports");
      break;
    case "settings":
      import("./components/Categories");
      break;
    case "history":
      import("./components/TransactionHistory");
      break;
    case "login":
      import("./components/Login");
      break;
    case "family":
      import("./components/FamilySetup");
      break;
    default:
      break;
  }
};

// Performance monitoring hook
const useAppPerformanceMonitoring = () => {
  useEffect(() => {
    // Monitor page load performance
    if ("performance" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "navigation") {
            console.log("Page load time:", entry.duration, "ms");
          }
        });
      });

      observer.observe({ entryTypes: ["navigation"] });

      return () => observer.disconnect();
    }
  }, []);
};

// App content component that uses auth context
const AppContent: React.FC = () => {
  const { user, loading, needsFamilySetup, setupFamily, firebaseUser } =
    useAuth();
  const [currentPage, setCurrentPage] = useState("home");
  const [loadingStage, setLoadingStage] = useState("auth");

  // Enable performance monitoring
  usePerformanceMonitoring();
  useAppPerformanceMonitoring();

  // Enhanced loading stages
  useEffect(() => {
    if (loading) {
      const stages = ["auth", "data", "ui"];
      let currentStage = 0;

      const interval = setInterval(() => {
        if (currentStage < stages.length - 1) {
          currentStage++;
          setLoadingStage(stages[currentStage]);
        } else {
          clearInterval(interval);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [loading]);

  // Preload components when app loads for better performance
  useEffect(() => {
    if (user) {
      // Preload the most commonly used components after initial load
      const timer = setTimeout(() => {
        preloadComponent("add");
        preloadComponent("reports");
      }, 1000); // Delay to avoid interfering with initial page load

      return () => clearTimeout(timer);
    } else {
      // Preload auth components when not logged in
      const timer = setTimeout(() => {
        preloadComponent("login");
        preloadComponent("family");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Enhanced page change handler with preloading
  const handlePageChange = (page: string) => {
    console.log("Page change requested:", page, "from:", currentPage);

    // Prevent unnecessary re-renders if already on the page
    if (currentPage === page) {
      console.log("Already on page:", page, "- skipping navigation");
      return;
    }

    setCurrentPage(page);

    // Preload other components when user navigates
    if (page === "home") {
      preloadComponent("add");
      preloadComponent("reports");
    } else if (page === "add") {
      preloadComponent("settings");
    } else if (page === "history") {
      preloadComponent("home");
    }
  };

  // Listen for custom navigation events
  useEffect(() => {
    const handleNavigateToHistory = () => {
      setCurrentPage("history");
    };

    window.addEventListener("navigate-to-history", handleNavigateToHistory);
    return () => {
      window.removeEventListener(
        "navigate-to-history",
        handleNavigateToHistory
      );
    };
  }, []);

  const handleBackFromHistory = () => {
    handlePageChange("home");
  };

  if (loading) {
    return <AuthLoader stage={loadingStage} />;
  }

  if (!user) {
    // Check if user is authenticated but needs family setup
    if (firebaseUser && needsFamilySetup) {
      return (
        <ErrorBoundary>
          <Suspense fallback={<PageLoader page="Family Setup" />}>
            <FamilySetup
              onFamilySetup={setupFamily}
              userEmail={firebaseUser.email || ""}
            />
          </Suspense>
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary>
        <Suspense fallback={<PageLoader page="Login" />}>
          <Login />
        </Suspense>
      </ErrorBoundary>
    );
  }

  const renderContent = () => {
    const getPageName = () => {
      switch (currentPage) {
        case "home":
          return "Dashboard";
        case "add":
          return "Add Transaction";
        case "reports":
          return "Reports";
        case "settings":
          return "Categories";
        case "history":
          return "Transaction History";
        default:
          return "Dashboard";
      }
    };

    return (
      <Suspense fallback={<PageLoader page={getPageName()} />}>
        {(() => {
          console.log("Rendering page:", currentPage);
          switch (currentPage) {
            case "home":
              return <Dashboard key="dashboard" />;
            case "add":
              return (
                <AddTransaction
                  key="add-transaction"
                  onBack={() => handlePageChange("home")}
                />
              );
            case "history":
              return (
                <TransactionHistory
                  key="transaction-history"
                  onBack={handleBackFromHistory}
                />
              );
            case "reports":
              console.log("Rendering Reports component");
              return (
                <Reports
                  key="reports"
                  onBack={() => handlePageChange("home")}
                />
              );
            case "settings":
              return (
                <Categories
                  key="categories"
                  onBack={() => handlePageChange("home")}
                />
              );
            default:
              console.log(
                "Unknown page, defaulting to Dashboard:",
                currentPage
              );
              return <Dashboard key="dashboard-default" />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <ErrorBoundary>
      <MobileLayout currentPage={currentPage} onPageChange={handlePageChange}>
        {renderContent()}
      </MobileLayout>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
