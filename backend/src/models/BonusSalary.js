class BonusSalary {
    /**
     * Constructor for BonusSalary.
     * @param {Array<{year: string, value: string}> | null} [data=null] - Optional initial bonus data.
     */
    constructor(data = null) {
        if (!data || !data.bonuses || data.bonuses.length === 0) {
            this.bonuses = [];
        } else {
            if (!Array.isArray(data.bonuses)) {
                throw new Error("Invalid data format: expected an array of bonus objects.");
            }

            // Validate and initialize bonuses
            this.bonuses = data.bonuses.map(bonus => {
                if (!bonus.year || typeof bonus.year !== 'string' || !bonus.value || typeof bonus.value !== 'string') {
                    throw new Error("Invalid bonus entry format: each bonus must have a valid 'year' (string) and 'value' (string).");
                }
                return { year: bonus.year, value: bonus.value };
            });
        }
    }

    /**
     * Add a new bonus entry.
     * @param {string} year - The year of the bonus.
     * @param {string} value - The value of the bonus as a string.
     */
    addBonus(year, value) {
        const existingBonus = this.getBonusByYear(year);
        if (existingBonus) {
            throw new Error(`Bonus for year ${year} already exists.`);
        }
        // Add the new bonus to the array
        this.bonuses.push({ year, value });
    
        // Sort the bonuses by year in descending order
        this.bonuses.sort((a, b) => b.year - a.year);
    }

    /**
     * Get all bonuses.
     * @returns {Array<{year: string, value: string}>} - List of bonus entries.
     */
    getBonuses() {
        return this.bonuses;
    }

    /**
     * Get bonus by year.
     * @param {string} year - The year to search for.
     * @returns {{year: string, value: string} | undefined} - The bonus entry for the given year.
     */
    getBonusByYear(year) {
        return this.bonuses.find(bonus => bonus.year === year);
    }

    /**
     * Update the bonus for a specific year.
     * @param {string} year - The year to update.
     * @param {string} newValue - The new bonus value as a string.
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
     * @returns {Array<{year: string, value: string}>} - JSON representation of the bonus entries.
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
