import {BonusSalaryRecordInterface} from './bonus-salary-record-interface';

export interface BackendResponseInterface {
    salesmanId: number;
    uid?: string;
    employeeId?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    bonusSalary: BonusSalaryRecordInterface[];
    jobTitle: string;
    department: string;
    gender?: string;
}
