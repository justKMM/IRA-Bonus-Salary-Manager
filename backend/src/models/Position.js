/**
 * Represents a position in a sales order.
 * @param {number} positionId - The unique identifier for the position.
 * @param {string} uid - The OpenCRX unique identifier for the position.
 * @param {number} amount - The total amount for the position (including any applicable discounts).
 * @param {number} baseAmount - The base amount for the position, before any discount or tax.
 * @param {number} taxAmount - The tax amount applied to the position.
 * @param {number} discountAmount - The discount amount applied to the position.
 * @param {number} quantity - The quantity of the product in this position.
 * @param {number} pricePerUnit - The price per unit of the product.
 * @param {Product} product - The product object.
 */
class Position {
    constructor(positionId, uid, amount, baseAmount, taxAmount, discountAmount, quantity, pricePerUnit, product) {
        this.positionId = positionId;
        this.uid = uid;
        this.amount = amount;
        this.baseAmount = baseAmount;
        this.taxAmount = taxAmount;
        this.discountAmount = discountAmount;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.product = product;
    }

    // Getter and setter for positionId
    get positionId() {
        return this._positionId;
    }

    set positionId(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('positionId must be a positive number.');
        }
        this._positionId = value;
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

    // Getter and setter for amount
    get amount() {
        return this._amount;
    }

    set amount(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('amount must be a non-negative number.');
        }
        this._amount = value;
    }

    // Getter and setter for baseAmount
    get baseAmount() {
        return this._baseAmount;
    }

    set baseAmount(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('baseAmount must be a non-negative number.');
        }
        this._baseAmount = value;
    }

    // Getter and setter for discountAmount
    get discountAmount() {
        return this._discountAmount;
    }

    set discountAmount(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('discountAmount must be a non-negative number.');
        }
        this._discountAmount = value;
    }

    // Getter and setter for quantity
    get quantity() {
        return this._quantity;
    }

    set quantity(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('quantity must be a positive number.');
        }
        this._quantity = value;
    }

    // Getter and setter for taxAmount
    get taxAmount() {
        return this._taxAmount;
    }

    set taxAmount(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('taxAmount must be a non-negative number.');
        }
        this._taxAmount = value;
    }

    // Getter and setter for pricePerUnit
    get pricePerUnit() {
        return this._pricePerUnit;
    }

    set pricePerUnit(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('pricePerUnit must be a non-negative number.');
        }
        this._pricePerUnit = value;
    }

    // Getter and setter for productUid
    get productUid() {
        return this._productUid;
    }

    set productUid(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('productUid must be a non-empty string.');
        }
        this._productUid = value;
    }

    // Getter and setter for product
    get product() {
        return this._product;
    }

    set product(value) {
        if (!value || typeof value !== 'object' || value.constructor.name !== 'Product') {
            throw new Error('product must be an instance of Product.');
        }
        this._product = value;
    }

    /**
     * Converts the Position instance to a plain JavaScript object.
     * @returns {Object} A plain object containing all position properties.
     */
    toJSON() {
        return {
            positionId: this.positionId,
            uid: this.uid,
            amount: this.amount,
            baseAmount: this.baseAmount,
            taxAmount: this.taxAmount,
            discountAmount: this.discountAmount,
            quantity: this.quantity,
            pricePerUnit: this.pricePerUnit,
            product: this.product.toJSON()
        };
    }
}

module.exports = Position;