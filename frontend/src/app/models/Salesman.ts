import { BonusSalary } from './BonusSalary';

export interface Salesman {
    salesmanId: number;
    uid?: string;          // optional since it can be null
    employeeId?: string;   // optional since it can be null
    firstName: string;
    middleName?: string;   // optional since it has default value
    lastName: string;
    bonusSalary?: BonusSalary[];
    jobTitle: string;
    department: string;
    gender?: string;
}
