const BonusSalary = require('./BonusSalary');

/**
 * Represents a salesman
 * @param {number} salesmanId - The unique identifier for the salesman (his government ID).
 * @param {string} uid - The OpenCRX unique identifier for the salesman (account).
 * @param {string} employeeId - The OrangeHRM unique identifier for the salesman (employee)
 * @param {string} firstName - The first name of the salesman.
 * @param {string} middleName - The middle name of the salesman (optional).
 * @param {string} lastName - The last name of the salesman.
 * @param {BonusSalary} bonusSalary - The bonus salary instance of the salesman.
 * @param {string} jobTitle - The job title of the salesman.
 * @param {string} department - The department of the salesman.
 * @param {string} gender - The gender of the salesman.
 */
class Salesman {
    constructor(salesmanId, uid, employeeId, firstName, middleName = '', lastName, bonusSalary = new BonusSalary(), jobTitle = '', department = '', gender = null) {
        this.salesmanId = salesmanId;
        this.uid = uid || null;
        this.employeeId = employeeId || null;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.bonusSalary = bonusSalary;
        this.jobTitle = jobTitle || '';
        this.department = department || '';
        this.gender = gender || null;
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

    // Getter and setter for uid
    get uid() {
        return this._uid;
    }

    set uid(value) {
        if (value !== null && (typeof value !== 'string' || !value.trim())) {
            throw new Error('uid must be a non-empty string.');
        }
        this._uid = value;
    }

    // Getter and setter for firstName
    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('firstName must be a non-empty string.');
        }
        this._firstName = value;
    }

    // Getter and setter for middleName
    get middleName() {
        return this._middleName;
    }

    set middleName(value) {
        this._middleName = value || '';
    }

    // Getter and setter for lastName
    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('lastName must be a non-empty string.');
        }
        this._lastName = value;
    }

    /**
     * Get the bonus salary instance.
     * @returns {BonusSalary} - The bonus salary instance.
     */
    get bonusSalary() {
        return this._bonusSalary;
    }

    /**
     * Set the bonus salary instance.
     * @param {BonusSalary} bonusSalary - The new bonus salary instance.
     */
    set bonusSalary(bonusSalary) {
        if (!(bonusSalary instanceof BonusSalary)) {
            throw new Error('bonusSalary must be an instance of BonusSalary.');
        }
        this._bonusSalary = bonusSalary;
    }

    // Getter and setter for jobTitle
    get jobTitle() {
        return this._jobTitle;
    }

    set jobTitle(value) {
        this._jobTitle = value || '';
    }

    // Getter and setter for employeeId
    get employeeId() {
        return this._employeeId;
    }

    set employeeId(value) {
        this._employeeId = value;
    }

    // Getter and setter for gender
    get gender() {
        return this._gender;
    }

    /**
     * Sets the gender of the salesman. Accepts the following values:
     * - 'male'
     * - 'female'
     * - 'other'
     * - null (for unknown gender)
     * The input is case-insensitive.
     * @param {string|null} value - The gender value to set.
     * @throws {Error} Throws an error if the value is not one of the accepted values.
     */
    set gender(value) {
        const validGenders = ['male', 'female', 'other', null];
        if (value && typeof value === 'string') {
            value = value.toLowerCase();
        }
        if (!validGenders.includes(value)) {
            throw new Error('gender must be one of: male, female, other, or null.');
        }
        this._gender = value;
    }

    /**
     * Gets the full name of the salesman, concatenating first, middle, and last names.
     * @returns {string} The full name of the salesman.
     */
    getFullName() {
        return `${this._firstName} ${this._middleName} ${this._lastName}`.trim();
    }

    /**
     * Converts the Salesman instance to a plain JavaScript object
     * @returns {Object} A plain object containing all properties
     */
    toJSON() {
        return {
            salesmanId: this.salesmanId,
            uid: this.uid,
            employeeId: this.employeeId,
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            bonusSalary: this.bonusSalary.toJSON(),
            jobTitle: this.jobTitle,
            department: this.department,
            gender: this.gender
        };
    }

    // CRUD methods for bonusSalary

    /**
     * Add a bonus entry to the bonusSalary instance.
     * @param {string} year - The year of the bonus.
     * @param {number} value - The value of the bonus.
     */
    addBonus(year, value) {
        this.bonusSalary.addBonus(year, value);
    }

    /**
     * Get all bonuses from the bonusSalary instance.
     * @returns {Array<{year: string, value: number}>} - List of bonus entries.
     */
    getAllBonuses() {
        return this.bonusSalary.getBonuses();
    }

    /**
     * Get bonus by year from the bonusSalary instance.
     * @param {string} year - The year to search for.
     * @returns {{year: string, value: number} | undefined} - The bonus entry for the given year.
     */
    getBonusByYear(year) {
        return this.bonusSalary.getBonusByYear(year);
    }

    /**
     * Update the bonus for a specific year in the bonusSalary instance.
     * @param {string} year - The year to update.
     * @param {number} newValue - The new bonus value.
     */
    updateBonus(year, newValue) {
        this.bonusSalary.updateBonus(year, newValue);
    }

    /**
     * Delete the bonus for a specific year in the bonusSalary instance.
     * @param {string} year - The year to delete.
     */
    deleteBonus(year) {
        this.bonusSalary.deleteBonus(year);
    }
}

module.exports = Salesman;