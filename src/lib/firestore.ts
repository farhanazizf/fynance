import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Transaction, Category } from "../types";
import { isDemoMode } from "./demo-auth";

// Demo data storage for development
let demoTransactions: Transaction[] = [];
let demoCategories: Category[] = [];

// Initialize demo data
const initDemoData = () => {
  if (demoCategories.length === 0) {
    demoCategories = defaultCategories.map((cat, index) => ({
      ...cat,
      id: `demo-cat-${index}`,
      familyId: "family-demo-001",
      createdAt: new Date(),
    }));
  }
};

// Transaction operations
export const transactionService = {
  // Add a new transaction
  async create(
    familyId: string,
    transaction: Omit<Transaction, "id" | "createdAt" | "familyId">
  ): Promise<string> {
    if (isDemoMode) {
      const newTransaction: Transaction = {
        ...transaction,
        id: `demo-txn-${Date.now()}`,
        familyId,
        createdAt: new Date(),
      };
      demoTransactions.push(newTransaction);
      return newTransaction.id;
    }

    const docRef = await addDoc(collection(db, "transactions"), {
      ...transaction,
      familyId, // Use familyId instead of userId for shared data
      date: Timestamp.fromDate(transaction.date),
      createdAt: Timestamp.fromDate(new Date()),
    });
    return docRef.id;
  },

  // Get all transactions for a family
  async getAll(familyId: string): Promise<Transaction[]> {
    if (isDemoMode) {
      initDemoData();
      return demoTransactions
        .filter((t) => t.familyId === familyId)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    const q = query(
      collection(db, "transactions"),
      where("familyId", "==", familyId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Transaction[];
  },

  // Get transactions within date range
  async getByDateRange(
    familyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    if (isDemoMode) {
      initDemoData();
      return demoTransactions
        .filter(
          (t) =>
            t.familyId === familyId && t.date >= startDate && t.date <= endDate
        )
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    const q = query(
      collection(db, "transactions"),
      where("familyId", "==", familyId),
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate)),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Transaction[];
  },

  // Update a transaction
  async update(
    id: string,
    updates: Partial<Omit<Transaction, "id" | "familyId" | "createdAt">>
  ): Promise<void> {
    if (isDemoMode) {
      const index = demoTransactions.findIndex((t) => t.id === id);
      if (index !== -1) {
        demoTransactions[index] = { ...demoTransactions[index], ...updates };
      }
      return;
    }

    const docRef = doc(db, "transactions", id);
    if (updates.date) {
      const { date, ...otherUpdates } = updates;
      await updateDoc(docRef, {
        ...otherUpdates,
        date: Timestamp.fromDate(date),
      });
    } else {
      await updateDoc(docRef, updates);
    }
  },

  // Delete a transaction
  async delete(id: string): Promise<void> {
    if (isDemoMode) {
      demoTransactions = demoTransactions.filter((t) => t.id !== id);
      return;
    }

    await deleteDoc(doc(db, "transactions", id));
  },
};

// Category operations
export const categoryService = {
  // Add a new category
  async create(
    familyId: string,
    category: Omit<Category, "id" | "createdAt" | "familyId">
  ): Promise<string> {
    if (isDemoMode) {
      const newCategory: Category = {
        ...category,
        id: `demo-cat-${Date.now()}`,
        familyId,
        createdAt: new Date(),
      };
      demoCategories.push(newCategory);
      return newCategory.id;
    }

    const docRef = await addDoc(collection(db, "categories"), {
      ...category,
      familyId, // Use familyId instead of userId for shared data
      createdAt: Timestamp.fromDate(new Date()),
    });
    return docRef.id;
  },

  // Get all categories for a family
  async getAll(familyId: string): Promise<Category[]> {
    if (isDemoMode) {
      initDemoData();
      return demoCategories
        .filter((c) => c.familyId === familyId)
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    const q = query(
      collection(db, "categories"),
      where("familyId", "==", familyId),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Category[];
  },

  // Get categories by type
  async getByType(
    familyId: string,
    type: "income" | "expense"
  ): Promise<Category[]> {
    if (isDemoMode) {
      initDemoData();
      return demoCategories
        .filter((c) => c.familyId === familyId && c.type === type)
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    const q = query(
      collection(db, "categories"),
      where("familyId", "==", familyId),
      where("type", "==", type),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Category[];
  },

  // Update a category
  async update(
    id: string,
    updates: Partial<Omit<Category, "id" | "familyId" | "createdAt">>
  ): Promise<void> {
    if (isDemoMode) {
      const index = demoCategories.findIndex((c) => c.id === id);
      if (index !== -1) {
        demoCategories[index] = { ...demoCategories[index], ...updates };
      }
      return;
    }

    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, updates);
  },

  // Delete a category
  async delete(id: string): Promise<void> {
    if (isDemoMode) {
      demoCategories = demoCategories.filter((c) => c.id !== id);
      return;
    }

    await deleteDoc(doc(db, "categories", id));
  },
};

// Default categories to create for new families
export const defaultCategories = [
  // Income categories
  { name: "Salary", type: "income" as const, color: "#52c41a", icon: "💰" },
  { name: "Freelance", type: "income" as const, color: "#1890ff", icon: "💻" },
  { name: "Investment", type: "income" as const, color: "#722ed1", icon: "📈" },
  {
    name: "Other Income",
    type: "income" as const,
    color: "#13c2c2",
    icon: "💵",
  },

  // Expense categories
  {
    name: "Food & Dining",
    type: "expense" as const,
    color: "#fa541c",
    icon: "🍽️",
  },
  {
    name: "Transportation",
    type: "expense" as const,
    color: "#faad14",
    icon: "🚗",
  },
  { name: "Shopping", type: "expense" as const, color: "#eb2f96", icon: "🛍️" },
  {
    name: "Entertainment",
    type: "expense" as const,
    color: "#f759ab",
    icon: "🎬",
  },
  {
    name: "Bills & Utilities",
    type: "expense" as const,
    color: "#fa8c16",
    icon: "📋",
  },
  {
    name: "Healthcare",
    type: "expense" as const,
    color: "#52c41a",
    icon: "🏥",
  },
  { name: "Education", type: "expense" as const, color: "#1890ff", icon: "📚" },
  { name: "Travel", type: "expense" as const, color: "#722ed1", icon: "✈️" },
  {
    name: "Other Expenses",
    type: "expense" as const,
    color: "#8c8c8c",
    icon: "💸",
  },
];

// Initialize default categories for a new family
export const initializeDefaultCategories = async (
  familyId: string
): Promise<void> => {
  const promises = defaultCategories.map((category) =>
    categoryService.create(familyId, category)
  );
  await Promise.all(promises);
};
