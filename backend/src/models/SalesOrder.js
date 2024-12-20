const Customer = require('./Customer');
const Salesman = require('./Salesman');

/**
 * Represents a sales order
 * @param {number} salesOrderId - The unique identifier for the sales order.
 * @param {string} uid - The OpenCRX unique identifier for the sales order.
* @param {number} customerId - The unique identifier for the customer.
 * @param {number} salesmanId - The unique identifier for the salesman.
 * @param {string} name - The name associated with the sales order.
 * @param {number} priority - The priority of the sales order.
 * @param {string} submitStatus - The submit status of the sales order (optional).
 * @param {string} pricingState - The pricing state of the sales order (optional).
 * @param {number} totalAmount - The total amount after discounts but before tax. 
 * @param {number} totalTaxAmount - The total tax amount for the sales order. 
 * @param {number} totalBaseAmount - The base amount before any tax or discount. 
 * @param {number} totalAmountIncludingTax - The total amount including tax for the sales order.
 * @param {number} totalDiscountAmount - The total discount amount for the order.
 * @param {number} totalSalesCommission - The total sales commission for the sales order.
 * @param {Array} positions - The array of positions in the sales order.
 */
class SalesOrder {
    constructor(salesOrderId, uid, customerId, salesmanId, name, year, priority, submitStatus, pricingState, totalAmount, totalTaxAmount, totalBaseAmount, totalAmountIncludingTax, 
                totalDiscountAmount, totalSalesCommission, positions = []) {
        this.salesOrderId = salesOrderId;
        this.uid = uid;
        this.customerId = customerId;
        this.salesmanId = salesmanId;
        this.name = name;
        this.year = year;
        this.priority = priority;
        this.submitStatus = submitStatus;
        this.pricingState = pricingState;
        this.totalAmount = totalAmount;
        this.totalTaxAmount = totalTaxAmount;
        this.totalBaseAmount = totalBaseAmount;
        this.totalAmountIncludingTax = totalAmountIncludingTax;
        this.totalDiscountAmount = totalDiscountAmount;
        this.totalSalesCommission = totalSalesCommission;
        this.positions = positions;
    }

    // Getter and setter for salesOrderId
    get salesOrderId() {
        return this._salesOrderId;
    }

    set salesOrderId(value) {
        if (typeof value !== 'number' || value < 0) {
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
        if (typeof value !== 'number' || value < 0) {
            throw new Error('totalAmountIncludingTax must be a non-negative number.');
        }
        this._totalAmountIncludingTax = value;
    }

    // Getter and setter for totalTaxAmount
    get totalTaxAmount() {
        return this._totalTaxAmount;
    }

    set totalTaxAmount(value) {
        if (typeof value !== 'number' || value < 0) {
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

    // Getter and setter for year
    get year() {
        return this._year;
    }

    set year(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('year must be a non-empty string.');
        }
        this._year = value;
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
        if (typeof value !== 'number' || value < 0) {
            throw new Error('totalBaseAmount must be a non-negative number.');
        }
        this._totalBaseAmount = value;
    }

    // Getter and setter for totalDiscountAmount
    get totalDiscountAmount() {
        return this._totalDiscountAmount;
    }

    set totalDiscountAmount(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('totalDiscountAmount must be a non-negative number.');
        }
        this._totalDiscountAmount = value;
    }

    // Getter and setter for totalAmount
    get totalAmount() {
        return this._totalAmount;
    }

    set totalAmount(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('totalAmount must be a non-negative number.');
        }
        this._totalAmount = value;
    }

    // Getter and setter for totalSalesCommission
    get totalSalesCommission() {
        return this._totalSalesCommission;
    }

    set totalSalesCommission(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('totalSalesCommission must be a non-negative number.');
        }
        this._totalSalesCommission = value;
    }

    // Getter and setter for priority
    get priority() {
        return this._priority;
    }

    set priority(value) {
        if (typeof value !== 'number' || value < 0) {
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

    // Getter and setter for customer
    get customer() {
        return this._customer;
    }

    set customer(value) {
        if (!(value instanceof Customer) && value !== null && value !== undefined) {
            throw new Error('customer must be an instance of Customer or null/undefined.');
        }
        this._customer = value;
    }

    // Getter and setter for salesman
    get salesman() {
        return this._salesman;
    }

    set salesman(value) {
        if (!(value instanceof Salesman) && value !== null && value !== undefined) {
            throw new Error('salesman must be an instance of Salesman or null/undefined.');
        }
        this._salesman = value;
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

    /**
     * Converts the SalesOrder instance to a plain JavaScript object
     * @returns {Object} Plain object representation of the sales order
     */
    toJSON() {
        return {
            salesOrderId: this.salesOrderId,
            uid: this.uid,
            customerId: this.customerId,
            salesmanId: this.salesmanId,
            name: this.name,
            year: this.year,
            priority: this.priority,
            submitStatus: this.submitStatus,
            pricingState: this.pricingState,
            totalAmount: this.totalAmount,
            totalTaxAmount: this.totalTaxAmount,
            totalBaseAmount: this.totalBaseAmount,
            totalAmountIncludingTax: this.totalAmountIncludingTax,
            totalDiscountAmount: this.totalDiscountAmount,
            totalSalesCommission: this.totalSalesCommission,
            positions: this.positions.map(position => position.toJSON())
        };
    }
}

module.exports = SalesOrder;