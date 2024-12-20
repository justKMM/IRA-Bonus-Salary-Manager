/**
 * Represents a product
 * @param {number} productId - The unique identifier for the product.
 * @param {string} name - The name of the product.
 * @param {string} uid - The OpenCRX unique identifier for the product.
 * @param {number} minQuantity - The minimum quantity of the product.
 * @param {number} maxQuantity - The maximum quantity of the product.
 * @param {number} minPositions - The minimum positions for the product.
 * @param {number} maxPositions - The maximum positions for the product.
 */
class Product {
    constructor(productId, name, uid, minQuantity, maxQuantity, minPositions, maxPositions) {
        this.productId = productId;
        this.name = name;
        this.uid = uid;
        this.minQuantity = minQuantity;
        this.maxQuantity = maxQuantity;
        this.minPositions = minPositions;
        this.maxPositions = maxPositions;
    }

    // Getter and setter for productId
    get productId() {
        return this._productId;
    }

    set productId(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('productId must be a positive number.');
        }
        this._productId = value;
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

    // Getter and setter for minQuantity
    get minQuantity() {
        return this._minQuantity;
    }

    set minQuantity(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('minQuantity must be a non-negative number.');
        }
        this._minQuantity = value;
    }

    // Getter and setter for maxQuantity
    get maxQuantity() {
        return this._maxQuantity;
    }

    set maxQuantity(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('maxQuantity must be a non-negative number.');
        }
        this._maxQuantity = value;
    }

    // Getter and setter for minPositions
    get minPositions() {
        return this._minPositions;
    }

    set minPositions(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('minPositions must be a non-negative number.');
        }
        this._minPositions = value;
    }

    // Getter and setter for maxPositions
    get maxPositions() {
        return this._maxPositions;
    }

    set maxPositions(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('maxPositions must be a non-negative number.');
        }
        this._maxPositions = value;
    }

    /**
     * Converts the Product instance to a plain JavaScript object
     * @returns {Object} Plain object representation of the Product
     */
    toJSON() {
        return {
            productId: this.productId,
            name: this.name,
            uid: this.uid,
            minQuantity: this.minQuantity,
            maxQuantity: this.maxQuantity,
            minPositions: this.minPositions,
            maxPositions: this.maxPositions
        };
    }
}

module.exports = Product;
