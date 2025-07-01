import type { Category } from "../types";
import { categoryService } from "../lib/firestore";

/**
 * Default categories for Indonesian users
 */
export const DEFAULT_CATEGORIES: Omit<
  Category,
  "id" | "createdAt" | "familyId"
>[] = [
  // Income Categories
  {
    name: "Gaji",
    type: "income",
    icon: "💰",
    color: "#16a34a",
  },
  {
    name: "Bonus",
    type: "income",
    icon: "🎁",
    color: "#059669",
  },
  {
    name: "Freelance",
    type: "income",
    icon: "💻",
    color: "#10b981",
  },
  {
    name: "Side Hustle",
    type: "income",
    icon: "🚀",
    color: "#059669",
  },
  {
    name: "Investasi",
    type: "income",
    icon: "📈",
    color: "#34d399",
  },
  {
    name: "Passive Income",
    type: "income",
    icon: "🏦",
    color: "#10b981",
  },
  {
    name: "Cashback/Reward",
    type: "income",
    icon: "🎊",
    color: "#22c55e",
  },
  {
    name: "Lain-lain",
    type: "income",
    icon: "💵",
    color: "#6ee7b7",
  },

  // Expense Categories
  {
    name: "Makanan & Minuman",
    type: "expense",
    icon: "🍽️",
    color: "#dc2626",
  },
  {
    name: "Transportasi",
    type: "expense",
    icon: "🚗",
    color: "#ea580c",
  },
  {
    name: "Belanja Groceries",
    type: "expense",
    icon: "🛒",
    color: "#d97706",
  },
  {
    name: "Kopi & Jajan",
    type: "expense",
    icon: "☕",
    color: "#92400e",
  },
  {
    name: "Ojek Online",
    type: "expense",
    icon: "🏍️",
    color: "#f59e0b",
  },
  {
    name: "Tagihan & Utilities",
    type: "expense",
    icon: "⚡",
    color: "#ca8a04",
  },
  {
    name: "Internet & Pulsa",
    type: "expense",
    icon: "📱",
    color: "#059669",
  },
  {
    name: "Entertainment",
    type: "expense",
    icon: "🎬",
    color: "#7c3aed",
  },
  {
    name: "Kesehatan",
    type: "expense",
    icon: "🏥",
    color: "#c026d3",
  },
  {
    name: "Olahraga & Gym",
    type: "expense",
    icon: "💪",
    color: "#dc2626",
  },
  {
    name: "Pendidikan",
    type: "expense",
    icon: "📚",
    color: "#2563eb",
  },
  {
    name: "Fashion & Kecantikan",
    type: "expense",
    icon: "👗",
    color: "#db2777",
  },
  {
    name: "Rumah & Furniture",
    type: "expense",
    icon: "🏠",
    color: "#059669",
  },
  {
    name: "Sewa Kost/Kontrakan",
    type: "expense",
    icon: "🏠",
    color: "#0d9488",
  },
  {
    name: "Bensin & Parkir",
    type: "expense",
    icon: "⛽",
    color: "#ea580c",
  },
  {
    name: "Belanja Online",
    type: "expense",
    icon: "📦",
    color: "#8b5cf6",
  },
  {
    name: "Gift & Donasi",
    type: "expense",
    icon: "🎁",
    color: "#10b981",
  },
  {
    name: "Tabungan",
    type: "expense",
    icon: "🏦",
    color: "#0d9488",
  },
  {
    name: "Asuransi",
    type: "expense",
    icon: "🛡️",
    color: "#0891b2",
  },
  {
    name: "Investasi",
    type: "expense",
    icon: "📈",
    color: "#1d4ed8",
  },
  {
    name: "Lain-lain",
    type: "expense",
    icon: "💳",
    color: "#64748b",
  },
];

/**
 * Create default categories for a family
 * @param familyId - The family ID to create categories for
 */
export const createDefaultCategories = async (
  familyId: string
): Promise<void> => {
  try {
    // Check if categories already exist
    const existingCategories = await categoryService.getAll(familyId);

    if (existingCategories.length > 0) {
      console.log("Categories already exist, skipping default creation");
      return;
    }

    // Create default categories
    const createPromises = DEFAULT_CATEGORIES.map((category) =>
      categoryService.create(familyId, category)
    );

    await Promise.all(createPromises);
    console.log(
      `Created ${DEFAULT_CATEGORIES.length} default categories for family ${familyId}`
    );
  } catch (error) {
    console.error("Error creating default categories:", error);
    throw error;
  }
};
