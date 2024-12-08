/**
 * Represents a salesman
 * @param {number} salesmanId - The unique identifier for the salesman.
 * @param {string} uid - The OpenCRX unique identifier for the salesman (account).
 * @param {string} firstName - The first name of the salesman.
 * @param {string} middleName - The middle name of the salesman (optional).
 * @param {string} lastName - The last name of the salesman.
 * @param {string} bonusSalary - The bonus salary of the salesman.
 * @param {string} jobTitle - The job title of the salesman.
 * @param {string} employeeId - The OrangeHRM unique identifier for the salesman (employee)
 * @param {string} gender - The gender of the salesman.
 */
class Salesman {
    constructor(salesmanId, uid, firstName, middleName, lastName) {
        this.salesmanId = salesmanId;
        this.uid = uid;
        this.firstName = firstName;
        this.middleName = middleName || '';
        this.lastName = lastName;
        this.bonusSalary = 0;
        this.jobTitle = '';
        this.employeeId = null;
        this.gender = null;
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
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('firstName must be a non-empty string.');
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

    // Getter and setter for bonusSalary
    get bonusSalary() {
        return this._bonusSalary;
    }

    set bonusSalary(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('bonusSalary must be a non-negative number.');
        }
        this._bonusSalary = value;
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
}

module.exports = Salesman;