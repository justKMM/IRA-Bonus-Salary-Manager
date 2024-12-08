/**
 * Represents a product
 * @param {number} salesOrderId - The unique identifier for the sales order.
 * @param {string} uid - The OpenCRX unique identifier for the sales order.
 * @param {number} totalAmountIncludingTax - The total amount including tax for the sales order.
 * @param {number} totalTaxAmount - The total tax amount for the sales order.
 * @param {string} name - The name associated with the sales order.
 * @param {string} submitStatus - The submit status of the sales order (optional).
 * @param {string} pricingState - The pricing state of the sales order (optional).
 * @param {number} totalBaseAmount - The base amount before any tax or discount.
 * @param {number} totalDiscountAmount - The total discount amount for the order.
 * @param {number} totalAmount - The total amount after discounts but before tax.
 * @param {number} totalSalesCommission - The total sales commission for the sales order.
 * @param {number} priority - The priority of the sales order.
 * @param {Array} positions - The array of positions in the sales order.
 */
class SalesOrder {
    constructor(salesOrderId, uid, totalAmountIncludingTax, totalTaxAmount, name, totalBaseAmount, 
                totalDiscountAmount, totalAmount, totalSalesCommission, priority, positions = [], 
                submitStatus, pricingState) {
        this.salesOrderId = salesOrderId;
        this.uid = uid;
        this.totalAmountIncludingTax = totalAmountIncludingTax;
        this.totalTaxAmount = totalTaxAmount;
        this.name = name;
        this.submitStatus = submitStatus;
        this.pricingState = pricingState;
        this.totalBaseAmount = totalBaseAmount;
        this.totalDiscountAmount = totalDiscountAmount;
        this.totalAmount = totalAmount;
        this.totalSalesCommission = totalSalesCommission;
        this.priority = priority;
        this.positions = positions;
    }

    // Getter and setter for salesOrderId
    get salesOrderId() {
        return this._salesOrderId;
    }

    set salesOrderId(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('salesOrderId must be a positive number.');
        }
        this._salesOrderId = value;
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

    // Getter and setter for totalAmountIncludingTax
    get totalAmountIncludingTax() {
        return this._totalAmountIncludingTax;
    }

    set totalAmountIncludingTax(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('totalAmountIncludingTax must be a non-negative number.');
        }
        this._totalAmountIncludingTax = value;
    }

    // Getter and setter for totalTaxAmount
    get totalTaxAmount() {
        return this._totalTaxAmount;
    }

    set totalTaxAmount(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('totalTaxAmount must be a non-negative number.');
        }
        this._totalTaxAmount = value;
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

    // Getter and setter for submitStatus
    get submitStatus() {
        return this._submitStatus;
    }

    set submitStatus(value) {
        if (typeof value !== 'number') {
            throw new Error('submitStatus must be a number.');
        }
        this._submitStatus = value;
    }

    // Getter and setter for pricingState
    get pricingState() {
        return this._pricingState;
    }

    set pricingState(value) {
        if (typeof value !== 'number') {
            throw new Error('pricingState must be a number.');
        }
        this._pricingState = value;
    }

    // Getter and setter for totalBaseAmount
    get totalBaseAmount() {
        return this._totalBaseAmount;
    }

    set totalBaseAmount(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('totalBaseAmount must be a non-negative number.');
        }
        this._totalBaseAmount = value;
    }

    // Getter and setter for totalDiscountAmount
    get totalDiscountAmount() {
        return this._totalDiscountAmount;
    }

    set totalDiscountAmount(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('totalDiscountAmount must be a non-negative number.');
        }
        this._totalDiscountAmount = value;
    }

    // Getter and setter for totalAmount
    get totalAmount() {
        return this._totalAmount;
    }

    set totalAmount(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('totalAmount must be a non-negative number.');
        }
        this._totalAmount = value;
    }

    // Getter and setter for totalSalesCommission
    get totalSalesCommission() {
        return this._totalSalesCommission;
    }

    set totalSalesCommission(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('totalSalesCommission must be a non-negative number.');
        }
        this._totalSalesCommission = value;
    }

    // Getter and setter for priority
    get priority() {
        return this._priority;
    }

    set priority(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('priority must be a positive number.');
        }
        this._priority = value;
    }

    // Getter and setter for positions
    get positions() {
        return this._positions;
    }

    set positions(value) {
        if (!Array.isArray(value)) {
            throw new Error('positions must be an array.');
        }
        this._positions = value;
    }
}

module.exports = SalesOrder;