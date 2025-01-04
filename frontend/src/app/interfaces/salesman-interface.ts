// import {BonusSalaryRecord} from './bonus-salary-record-interface';

import {BonusSalaryRecordInterface} from './bonus-salary-record-interface';

export interface SalesmanInterface {
    salesmanId: number;
    uid?: string;          // optional since it can be null
    employeeId?: string;   // optional since it can be null
    firstName: string;
    middleName?: string;   // optional since it has default value
    lastName: string;
    bonusSalary?: BonusSalaryRecordInterface[];
    jobTitle: string;
    department: string;
    gender?: string;
}
