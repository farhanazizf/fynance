/**
 * Currency utility functions for Indonesian Rupiah (IDR)
 */

/**
 * Format number as Indonesian Rupiah currency
 * @param amount - The amount to format
 * @param options - Additional formatting options
 * @returns Formatted currency string
 */
export const formatIDR = (
  amount: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSymbol?: boolean;
  } = {}
): string => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    showSymbol = true,
  } = options;

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const formatted = formatter.format(amount);

  // If showSymbol is false, remove the currency symbol
  if (!showSymbol) {
    return formatted.replace(/Rp\s?/, "");
  }

  return formatted;
};

/**
 * Format number with thousand separators (no currency symbol)
 * @param amount - The amount to format
 * @returns Formatted number string with dots as thousand separators
 */
export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

/**
 * Parse Indonesian formatted number string to number
 * @param value - The formatted string to parse
 * @returns Parsed number
 */
export const parseIDR = (value: string): number => {
  // Remove all non-digit characters except dots and commas
  const cleanValue = value.replace(/[^\d,.]/g, "");

  // Handle Indonesian number format (dots for thousands, comma for decimals)
  // Convert to standard format
  const standardFormat = cleanValue.replace(/\./g, "").replace(/,/g, ".");

  return parseFloat(standardFormat) || 0;
};

/**
 * Currency symbol for Indonesian Rupiah
 */
export const IDR_SYMBOL = "Rp";

/**
 * Maximum amount for transactions (100 billion IDR)
 */
export const MAX_AMOUNT = 100_000_000_000;
