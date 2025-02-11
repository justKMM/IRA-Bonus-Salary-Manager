import {SalesPerformance} from './SalesPerformance';
import {SocialPerformance} from './SocialPerformance';

export interface Evaluation extends Iterable<Evaluation> {
    salesmanId: number;
    fullname?: string;
    department?: string;
    year: number;
    bonus: number;
    salesEvaluation: SalesPerformance[];
    socialEvaluation: SocialPerformance[];
    remark?: string;
    acceptedHR: false;
    acceptedCEO: false;
    acceptedSalesman: false;
}
