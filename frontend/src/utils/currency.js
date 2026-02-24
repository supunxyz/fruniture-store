// Currency utility — Sri Lankan Rupees
export const CURRENCY = 'Rs.';

/**
 * Format a number as Sri Lankan Rupees.
 * e.g. formatPrice(1500) → "Rs. 1,500.00"
 */
export const formatPrice = (amount) => {
    if (amount == null || isNaN(amount)) return `${CURRENCY} 0.00`;
    return `${CURRENCY} ${Number(amount).toLocaleString('en-LK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};
