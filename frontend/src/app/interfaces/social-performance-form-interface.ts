import {IndividualSocialPerformanceInterface} from './individual-social-performance-interface';

export interface SocialPerformanceFormInterface {
    salesmanId: number;
    socialId: number;
    values: [
        leadership: IndividualSocialPerformanceInterface,
        openness: IndividualSocialPerformanceInterface,
        socialBehavior: IndividualSocialPerformanceInterface,
        communication: IndividualSocialPerformanceInterface,
        integrity: IndividualSocialPerformanceInterface,
    ];
    year: number;
    comments: string;
}
