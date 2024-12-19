/**
 * Represents a sales performance record of a salesman
 * @param {number} salesmanId - The unique identifier for the salesman.
 * @param {string} productName - The name of the product sold.
 * @param {string} customer - The name of the customer.
 * @param {string} customerRanking - The ranking of the customer.
 * @param {number} items - The number of items sold.
 */
class SalesPerformance {
    constructor(salesmanId, productName, customer, customerRanking, items) {
        this.salesmanId = salesmanId;
        this.productName = productName;
        this.customer = customer;
        this.customerRanking = customerRanking;
        this.items = items;
    }

    // Getter and setter for salesmanId
    get salesmanId() {
        return this._salesmanId;
    }

    set salesmanId(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('salesmanId must be a positive number.');
        }
        this._salesmanId = value;
    }

    // Getter and setter for productName
    get productName() {
        return this._productName;
    }

    set productName(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('productName must be a non-empty string.');
        }
        this._productName = value;
    }

    // Getter and setter for customer
    get customer() {
        return this._customer;
    }

    set customer(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('customer must be a non-empty string.');
        }
        this._customer = value;
    }

    // Getter and setter for customerRanking
    get customerRanking() {
        return this._customerRanking;
    }

    set customerRanking(value) {
        const validRankings = ['excellent', 'good', 'fair', 'poor'];
        if (typeof value !== 'string' || !validRankings.includes(value.toLowerCase())) {
            throw new Error('customerRanking must be one of: excellent, good, fair, poor');
        }
        this._customerRanking = value.toLowerCase();
    }

    // Getter and setter for items
    get items() {
        return this._items;
    }

    set items(value) {
        if (typeof value !== 'number' || value < 0 || !Number.isInteger(value)) {
            throw new Error('items must be a non-negative integer.');
        }
        this._items = value;
    }

    /**
     * Converts the SalesPerformance instance to a plain JavaScript object
     * @returns {Object} A plain object containing all properties
     */
    toJSON() {
        return {
            salesmanId: this.salesmanId,
            productName: this.productName,
            customer: this.customer,
            customerRanking: this.customerRanking,
            items: this.items
        };
    }
}