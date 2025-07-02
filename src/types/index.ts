export interface User {
  uid: string;
  email: string;
  displayName?: string;
  familyId?: string; // For shared family/household data
}

// Family/household for shared financial tracking
export interface Family {
  id: string;
  name: string;
  members: string[]; // Array of user UIDs
  createdAt: Date;
  createdBy: string;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon?: string;
  createdAt: Date;
  familyId: string; // Changed from userId to familyId for sharing
}

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  category?: Category;
  description: string;
  date: Date;
  createdAt: Date;
  familyId: string; // Changed from userId to familyId for sharing
  addedBy?: string; // Email or UID of the family member who added the transaction
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  netCashflow: number;
  transactions: Transaction[];
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    total: number;
    count: number;
    percentage: number;
  }[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type ReportPeriod = "week" | "month" | "custom";
