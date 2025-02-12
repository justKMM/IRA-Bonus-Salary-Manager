/**
 * Represents a social performance record of a salesman
 *
 * @param {number} salesmanId - The unique identifier for the salesman.
 * @param {number} socialId - The unique identifier for the social performance record.
 * @param {string} description - A description of the social performance goal.
 * @param {number} targetValue - The target value for the goal.
 * @param {number} actualValue - The actual value achieved by the salesman.
 * @param {number} year - The year the performance record is for.
 */
export interface SocialPerformance {
    salesmanId?: number;
    socialId?: number;
    description: string;
    targetValue: number;
    actualValue: number;
    year?: number;
    bonus?: number;
}
