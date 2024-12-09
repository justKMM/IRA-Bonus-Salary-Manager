import {BonusSalaryRecord} from './bonus-salary-record-interface';

export interface SalesManInterface {
    id: string;
    name: string;
    records: BonusSalaryRecord[];
}
