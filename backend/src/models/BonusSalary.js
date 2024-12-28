class BonusSalary {
    constructor() {
        this.bonuses = [];
    }

    /**
     * Add a new bonus entry.
     * @param {string} year - The year of the bonus.
     * @param {number} value - The value of the bonus.
     */
    addBonus(year, value) {
        const existingBonus = this.getBonusByYear(year);
        if (existingBonus) {
            throw new Error(`Bonus for year ${year} already exists.`);
        }
        this.bonuses.push({ year, value });
    }

    /**
     * Get all bonuses.
     * @returns {Array<{year: string, value: number}>} - List of bonus entries.
     */
    getBonuses() {
        return this.bonuses;
    }

    /**
     * Get bonus by year.
     * @param {string} year - The year to search for.
     * @returns {{year: string, value: number} | undefined} - The bonus entry for the given year.
     */
    getBonusByYear(year) {
        return this.bonuses.find(bonus => bonus.year === year);
    }

    /**
     * Update the bonus for a specific year.
     * @param {string} year - The year to update.
     * @param {number} newValue - The new bonus value.
     * @throws {Error} - Throws an error if the bonus for the given year doesn't exist.
     */
    updateBonus(year, newValue) {
        const existingBonus = this.getBonusByYear(year);
        if (!existingBonus) {
            throw new Error(`Bonus for year ${year} not found.`);
        }
        existingBonus.value = newValue;
    }

    /**
     * Delete the bonus entry for a specific year.
     * @param {string} year - The year to delete.
     * @throws {Error} - Throws an error if the bonus for the given year doesn't exist.
     */
    deleteBonus(year) {
        const bonusIndex = this.bonuses.findIndex(bonus => bonus.year === year);
        if (bonusIndex === -1) {
            throw new Error(`Bonus for year ${year} not found.`);
        }
        this.bonuses.splice(bonusIndex, 1);
    }

    /**
     * Convert the bonus entries to JSON format.
     * @returns {Array<{year: string, value: number}>} - JSON representation of the bonus entries.
     */
    toJSON() {
        return this.bonuses;
    }

    /**
     * Check if the bonus entries array is empty.
     * @returns {boolean} - True if the bonus entries array is empty, false otherwise.
     */
    isEmpty() {
        return this.bonuses.length === 0;
    }
}

module.exports = BonusSalary;