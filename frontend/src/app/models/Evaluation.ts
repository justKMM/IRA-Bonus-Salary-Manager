import {SalesPerformance} from './SalesPerformance';
import {SocialPerformance} from './SocialPerformance';

export interface Evaluation {
    salesmanId: number;
    fullname?: string;
    department?: string;
    year: number;
    bonus: number;
    salesEvaluation: SalesPerformance[];
    socialEvaluation: SocialPerformance[];
    remark?: string;
    acceptedHR: boolean;
    acceptedCEO: boolean;
    acceptedSalesman: boolean;
}
