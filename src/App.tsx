import React, { useState, Suspense, lazy, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { MobileLayout } from "./components/MobileLayout";

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
const PageLoader: React.FC<{ page?: string }> = ({ page }) => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">
        {page ? `Loading ${page}...` : "Loading..."}
      </p>
    </div>
  </div>
);

// Authentication loading component
const AuthLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Initializing app...</p>
    </div>
  </div>
);

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
const usePerformanceMonitoring = () => {
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

  // Enable performance monitoring
  usePerformanceMonitoring();

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
    setCurrentPage(page);

    // Preload other components when user navigates
    if (page === "home") {
      preloadComponent("add");
      preloadComponent("reports");
    } else if (page === "add") {
      preloadComponent("settings");
    }
  };

  if (loading) {
    return <AuthLoader />;
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
        default:
          return "Dashboard";
      }
    };

    return (
      <Suspense fallback={<PageLoader page={getPageName()} />}>
        {(() => {
          switch (currentPage) {
            case "home":
              return <Dashboard />;
            case "add":
              return <AddTransaction onBack={() => handlePageChange("home")} />;
            case "reports":
              return <Reports onBack={() => handlePageChange("home")} />;
            case "settings":
              return <Categories onBack={() => handlePageChange("home")} />;
            default:
              return <Dashboard />;
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
