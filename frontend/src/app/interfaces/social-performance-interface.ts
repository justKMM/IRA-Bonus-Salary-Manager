import {AbstractControl} from '@angular/forms';

export interface SocialPerformanceInterface{
    salesmanId: number;
    socialId: number | AbstractControl<any, any>;
    description: string | AbstractControl<any, any>;
    targetValue: number | AbstractControl<any, any>;
    actualValue: number | AbstractControl<any, any>;
    year: number | AbstractControl<any, any>;
}
