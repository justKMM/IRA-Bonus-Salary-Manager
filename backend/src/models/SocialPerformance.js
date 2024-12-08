/**
 * Represents a social performance record of a salesman
 * @param {number} salesmanId - The unique identifier for the salesman.
 * @param {number} goalId - The unique identifier for the social performance record..
 * @param {string} description - A description of the social performance goal.
 * @param {number} targetValue - The target value for the goal.
 * @param {number} actualValue - The actual value achieved by the salesman.
 * @param {number} year - The year the performance record is for.
 */
class SocialPerformance {
    constructor(salesmanId, goalId, description, targetValue, actualValue, year) {
        this.salesmanId = salesmanId;
        this.goalId = goalId;
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

    // Getter and setter for goalId
    get goalId() {
        return this._goalId;
    }

    set goalId(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error('goalId must be a positive number.');
        }
        this._goalId = value;
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
}

module.exports = SocialPerformance;