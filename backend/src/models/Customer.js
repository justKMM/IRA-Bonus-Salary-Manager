/**
 * Represents a customer
 * @param {number} customerId - The unique identifier for the customer.
 * @param {string} uid - The OpenCRX unique identifier for the customer (account).
 * @param {string} name - The name of the customer.
 * @param {number} rating - The rating of the customer (from 1 to 5).
 */
class Customer {
    constructor(customerId, uid, name, rating) {
        this.customerId = customerId;
        this.uid = uid;
        this.name = name;
        this.rating = rating;
    }

    // Getter and setter for customerId
    get customerId() {
        return this._customerId;
    }

    set customerId(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('customerId must be a positive number.');
        }
        this._customerId = value;
    }

    // Getter and setter for uid
    get uid() {
        return this._uid;
    }

    set uid(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('uid must be a non-empty string.');
        }
        this._uid = value;
    }

    // Getter and setter for name
    get name() {
        return this._name;
    }

    set name(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('name must be a non-empty string.');
        }
        this._name = value;
    }

    // Getter and setter for rating
    get rating() {
        return this._rating;
    }

    set rating(value) {
        const validRatings = [0, 1, 2, 3];
        if (!validRatings.includes(value)) {
            throw new Error('rating must be one of: 0 (okay), 1 (good), 2 (very good), or 4 (excellent).');
        }
        this._rating = value;
    }

    /**
     * Returns a string representation of the rating.
     * @returns {string} The description of the rating.
     */
    get ratingString() {
        const ratingDescriptions = {
            0: 'okay',
            1: 'good',
            2: 'very good',
            3: 'excellent'
        };
        return ratingDescriptions[this.rating] || 'Unknown rating';
    }

    /**
     * Converts the Customer instance to a plain JavaScript object
     * @returns {Object} A plain object containing all properties
     */
    toJSON() {
        return {
            customerId: this.customerId,
            uid: this.uid,
            name: this.name,
            rating: this.rating
        };
    }
}

module.exports = Customer;