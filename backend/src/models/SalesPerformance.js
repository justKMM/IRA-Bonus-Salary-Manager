/**
 * Represents a sales performance record of a salesman
 * @param {number} salesmanId - The unique identifier for the salesman.
 * @param {string} productName - The name of the product sold.
 * @param {string} customer - The name of the customer.
 * @param {string} customerRating - The rating of the customer.
 * @param {number} items - The number of items sold.
 * @param {number} bonus - The bonus amount for the sale (optional).
 */
class SalesPerformance {
    constructor(salesmanId, productName, customer, customerRating, items, bonus) {
        this.salesmanId = salesmanId;
        this.productName = productName;
        this.customer = customer;
        this.customerRating = customerRating;
        this.items = items;
        this.bonus = bonus;
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

    // Getter and setter for customerRating
    get customerRating() {
        return this._customerRating;
    }

    set customerRating(value) {
        const validRatings = [0, 1, 2, 3];
        if (!validRatings.includes(value)) {
            throw new Error('customerRating must be one of: 0 (okay), 1 (good), 2 (very good), or 3 (excellent).');
        }
        this._customerRating = value;
    }

    /**
     * Returns a string representation of the customer rating.
     * @returns {string} The description of the rating.
     */
    get customerRatingString() {
        const ratingDescriptions = {
            0: 'okay',
            1: 'good',
            2: 'very good',
            3: 'excellent'
        };
        return ratingDescriptions[this.customerRating] || 'Unknown rating';
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

    // Getter and setter for bonus
    get bonus() {
        return this._bonus;
    }

    set bonus(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('bonus must be a non-negative number.');
        }
        this._bonus = value;
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
            customerRating: this.customerRating,
            items: this.items,
            bonus: this.bonus
        };
    }
}

module.exports = SalesPerformance;