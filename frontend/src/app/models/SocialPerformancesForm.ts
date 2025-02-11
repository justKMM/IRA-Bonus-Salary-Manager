import {SocialPerformance} from './SocialPerformance';

export interface SocialPerformancesForm {
    salesmanId: number;
    socialId: number;
    values: [
        leadership: SocialPerformance,
        openness: SocialPerformance,
        socialBehavior: SocialPerformance,
        communication: SocialPerformance,
        integrity: SocialPerformance,
    ];
    year: number;
    comments: string;
}
