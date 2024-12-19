class Evaluation {
    constructor(fullname, salesmanId, department, year, remark) {
        this.fullname = fullname;
        this.salesmanId = salesmanId;
        this.department = department;
        this.year = year;
        this.salesEvaluation = [];
        this.socialEvaluation = [];
        this.remark = remark || '';
        this.acceptedCEO = false;
        this.acceptedSalesman = false;
    }

    // Getter and setter for fullname
    get fullname() {
        return this._fullname;
    }

    set fullname(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('fullname must be a non-empty string.');
        }
        this._fullname = value.trim();
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

    // Getter and setter for department
    get department() {
        return this._department;
    }

    set department(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error('department must be a non-empty string.');
        }
        this._department = value.trim();
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

    // Getter and setter for remark
    get remark() {
        return this._remark;
    }

    set remark(value) {
        if (typeof value !== 'string') {
            throw new Error('remark must be a string.');
        }
        this._remark = value.trim();
    }

    // Getter and setter for acceptedCEO
    get acceptedCEO() {
        return this._acceptedCEO;
    }

    set acceptedCEO(value) {
        this._acceptedCEO = Boolean(value);
    }

    // Getter and setter for acceptedSalesman
    get acceptedSalesman() {
        return this._acceptedSalesman;
    }

    set acceptedSalesman(value) {
        this._acceptedSalesman = Boolean(value);
    }

    // Getters for calculated bonuses
    get salesTotalBonus() {
        return this.salesEvaluation.reduce((total, sale) => total + sale.bonus, 0);
    }
    
    get socialTotalBonus() {
        return this.socialEvaluation.reduce((total, social) => total + social.bonus, 0);
    }

    get totalBonus() {
        return this.salesTotalBonus + this.socialTotalBonus;
    }

    /**
     * Converts the Evaluation instance to a plain JavaScript object
     * @returns {Object} A plain object containing all properties
     */
    toJSON() {
        return {
            fullname: this.fullname,
            salesmanId: this.salesmanId,
            department: this.department,
            year: this.year,
            salesEvaluation: this.salesEvaluation,
            salesTotalBonus: this.salesTotalBonus,
            socialEvaluation: this.socialEvaluation,
            socialTotalBonus: this.socialTotalBonus,
            totalBonus: this.totalBonus,
            remark: this.remark,
            acceptedCEO: this.acceptedCEO,
            acceptedSalesman: this.acceptedSalesman
        };
    }   
}

module.exports = Evaluation;