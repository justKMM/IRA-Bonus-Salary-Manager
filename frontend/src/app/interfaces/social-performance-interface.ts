export interface SocialPerformanceInterface extends Iterable<SocialPerformanceInterface>{
    salesmanId: number;
    socialId: number;
    description: string;
    targetValue: number;
    actualValue: number;
    year: string;
}
