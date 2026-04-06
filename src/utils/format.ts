/**
 * Formats a price string or number with a currency symbol (₱) and comma separators.
 * Handles inputs like "1000000", "₱1000000", or raw numbers.
 */
export const formatPrice = (price: string | number | undefined | null): string => {
    if (price === undefined || price === null || price === '') return '₱0';
    
    // Remove all non-numeric characters to get a clean number string
    const numericStr = String(price).replace(/[^0-9]/g, '');
    
    if (!numericStr) return '₱0';
    
    const num = parseInt(numericStr, 10);
    if (isNaN(num)) return '₱0';
    
    // Use toLocaleString() to add comma separators
    return `₱${num.toLocaleString()}`;
};

/**
 * Formats a raw number into a string with commas (no currency symbol).
 * Useful for inputs.
 */
export const formatNumberWithCommas = (value: string | number): string => {
    const numericStr = String(value).replace(/[^0-9]/g, '');
    if (!numericStr) return '';
    const num = parseInt(numericStr, 10);
    if (isNaN(num)) return '';
    return num.toLocaleString();
};
