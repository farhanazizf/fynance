import { categoryService } from "../lib/firestore";
import type { Category } from "../types";

/**
 * Clean up duplicate categories for a family
 * This function can be called manually to remove duplicates
 */
export const cleanupDuplicateCategories = async (
  familyId: string
): Promise<void> => {
  try {
    console.log("Starting cleanup of duplicate categories...");

    // Get all categories for the family
    const categories = await categoryService.getAll(familyId);
    console.log(`Found ${categories.length} total categories`);

    if (categories.length === 0) {
      console.log("No categories found, nothing to cleanup");
      return;
    }

    // Group categories by name and type (case-insensitive)
    const categoryGroups = new Map<string, Category[]>();

    categories.forEach((category) => {
      const key = `${category.name.toLowerCase().trim()}-${category.type}`;
      if (!categoryGroups.has(key)) {
        categoryGroups.set(key, []);
      }
      categoryGroups.get(key)!.push(category);
    });

    // Find and remove duplicates
    const deletePromises: Promise<void>[] = [];
    let duplicatesFound = 0;

    categoryGroups.forEach((categoriesWithSameName) => {
      if (categoriesWithSameName.length > 1) {
        // Sort by creation date and keep the oldest one
        const sorted = categoriesWithSameName.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );

        const [keep, ...duplicates] = sorted;
        duplicatesFound += duplicates.length;

        console.log(
          `Found ${duplicates.length} duplicates for: ${keep.name} (${keep.type})`
        );
        console.log(
          `Keeping category ID: ${keep.id}, created: ${keep.createdAt}`
        );

        duplicates.forEach((duplicate, index) => {
          console.log(
            `Deleting duplicate ${index + 1}: ${duplicate.id}, created: ${
              duplicate.createdAt
            }`
          );
          deletePromises.push(categoryService.delete(duplicate.id));
        });
      }
    });

    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
      console.log(
        `✅ Successfully removed ${duplicatesFound} duplicate categories`
      );
      console.log(`📊 Categories before cleanup: ${categories.length}`);
      console.log(
        `📊 Categories after cleanup: ${categories.length - duplicatesFound}`
      );
    } else {
      console.log("✅ No duplicate categories found!");
    }
  } catch (error) {
    console.error("❌ Error cleaning up duplicate categories:", error);
    throw error;
  }
};

/**
 * Get a summary of categories including duplicates
 */
export const getCategorySummary = async (familyId: string) => {
  try {
    const categories = await categoryService.getAll(familyId);

    const summary = {
      total: categories.length,
      income: categories.filter((c) => c.type === "income").length,
      expense: categories.filter((c) => c.type === "expense").length,
      duplicates: 0,
    };

    // Count duplicates
    const seen = new Set<string>();
    categories.forEach((category) => {
      const key = `${category.name.toLowerCase().trim()}-${category.type}`;
      if (seen.has(key)) {
        summary.duplicates++;
      } else {
        seen.add(key);
      }
    });

    return summary;
  } catch (error) {
    console.error("Error getting category summary:", error);
    throw error;
  }
};
