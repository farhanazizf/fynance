/**
 * Utility functions for user display names and formatting
 */

/**
 * Format addedBy field for display
 * Extracts name from email or returns the provided string
 * @param addedBy - Email, UID, or display name
 * @returns Formatted display name
 */
export const formatAddedBy = (addedBy?: string): string => {
  if (!addedBy) return "Unknown";

  // If it looks like an email, extract the name part
  if (addedBy.includes("@")) {
    const name = addedBy.split("@")[0];
    // Replace dots and underscores with spaces and capitalize
    return name
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // If it's a UID (long alphanumeric string), return "User"
  if (addedBy.length > 20 && /^[a-zA-Z0-9]+$/.test(addedBy)) {
    return "User";
  }

  // Otherwise return as is (might be a display name)
  return addedBy;
};

/**
 * Get user initials from email or name
 * @param addedBy - Email, UID, or display name
 * @returns User initials (max 2 characters)
 */
export const getUserInitials = (addedBy?: string): string => {
  if (!addedBy) return "U";

  if (addedBy.includes("@")) {
    const name = addedBy.split("@")[0];
    const words = name.replace(/[._]/g, " ").split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0].substring(0, 2).toUpperCase();
  }

  // For UIDs or other strings, just return first 2 chars
  return addedBy.substring(0, 2).toUpperCase();
};
