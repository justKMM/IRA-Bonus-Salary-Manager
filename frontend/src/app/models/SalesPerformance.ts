/**
 * Represents a sales performance record of a salesman
 *
 * @param {number} salesmanId - The unique identifier for the salesman.
 * @param {string} productName - The name of the product sold.
 * @param {string} customer - The name of the customer.
 * @param {string} customerRating - The rating of the customer.
 * @param {number} items - The number of items sold.
 * @param {number} bonus - The bonus amount for the sale (optional).
 */
export interface SalesPerformance {
    salesmanId: number;
    productName: string;
    customer: string;
    customerRating: string;
    items: number;
    bonus: number;
}
