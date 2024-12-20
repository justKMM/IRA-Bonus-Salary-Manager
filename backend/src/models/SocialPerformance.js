/**
 * Represents a social performance record of a salesman
 * @param {number} salesmanId - The unique identifier for the salesman.
 * @param {number} socialId - The unique identifier for the social performance record.
 * @param {string} description - A description of the social performance goal.
 * @param {number} targetValue - The target value for the goal.
 * @param {number} actualValue - The actual value achieved by the salesman.
 * @param {number} year - The year the performance record is for.
 */
class SocialPerformance {
    constructor(salesmanId, socialId, description, targetValue, actualValue, year) {
        this.salesmanId = salesmanId;
        this.socialId = socialId;
        this.description = description;
        this.targetValue = targetValue;
        this.actualValue = actualValue;
        this.year = year;
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

    // Getter and setter for socialId
    get socialId() {
        return this._socialId;
    }

    set socialId(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('socialId must be a positive number.');
        }
        this._socialId = value;
    }

    // Getter and setter for description
    get description() {
        return this._description;
    }

    set description(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('description must be a non-empty string.');
        }
        this._description = value;
    }

    // Getter and setter for targetValue
    get targetValue() {
        return this._targetValue;
    }

    set targetValue(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('targetValue must be a non-negative number.');
        }
        this._targetValue = value;
    }

    // Getter and setter for actualValue
    get actualValue() {
        return this._actualValue;
    }

    set actualValue(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('actualValue must be a non-negative number.');
        }
        this._actualValue = value;
    }

    // Getter and setter for year
    get year() {
        return this._year;
    }

    set year(value) {
        if (typeof value !== 'number' || value < 1900 || value > new Date().getFullYear()) {
            throw new Error('year must be a valid number between 1900 and the current year.');
        }
        this._year = value;
    }

    set bonus(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('bonus must be a non-negative number.');
        }
        this._targetValue = value;
    }

    /**
     * Calculates and returns the bonus amount based on actual vs target performance.
     * The bonus is calculated as 10€ per actual value unit.
     * If actual value meets or exceeds target, full bonus is awarded.
     * If actual value is below target, bonus is reduced to 80%.
     * If target value is 0, bonus is 0.
     * @returns {number} The calculated bonus amount in euros, rounded up to next multiple of 10
     */
    get bonus() {
        if (this.targetValue === 0) return 0;
        
        const baseBonus = this.actualValue * 10; // 10€ per actual value unit
        const multiplier = this.actualValue >= this.targetValue ? 1 : 0.8;
        const calculatedBonus = baseBonus * multiplier;
        
        return Math.ceil(calculatedBonus / 10) * 10;
    }


    /**
     * Converts the SocialPerformance instance to a plain JavaScript object
     * @returns {Object} A plain object containing all properties
     */
    toJSON() {
        return {
            salesmanId: this.salesmanId,
            socialId: this.socialId,
            description: this.description,
            targetValue: this.targetValue,
            actualValue: this.actualValue,
            year: this.year,
            bonus: this.bonus
        };
    }
}

module.exports = SocialPerformance;