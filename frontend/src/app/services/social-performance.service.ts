import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {SocialPerformanceInterface} from '../interfaces/social-performance-interface';

@Injectable({
    providedIn: 'root'
})
export class SocialPerformanceService {

    constructor(private http: HttpClient) { }
    private currentCounter = 0;

    getSocialPerformanceBySalesmanId(salesmanId: number): Observable<HttpResponse<SocialPerformanceInterface[]>> {
        return this.http.get<SocialPerformanceInterface[]>(
            environment.apiEndpoint + `/api/salesmen/performance/${salesmanId}`,
            {observe: 'response', withCredentials: true}
        )
            .pipe(
                map((response: HttpResponse<SocialPerformanceInterface[]>): HttpResponse<SocialPerformanceInterface[]> => {
                    // Filter out any null or undefined entries before mapping
                    const mappedData: SocialPerformanceInterface[] = response.body
                        .filter((res: SocialPerformanceInterface): boolean => res !== null && res !== undefined);
                    console.log('Raw response:', response.body);

                    return new HttpResponse({
                        body: mappedData,
                        headers: response.headers,
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url
                    });
                })
            );
    }

    createSocialPerformance(socialPerformanceData: SocialPerformanceInterface): void {
        const payload = {
            salesmanId: Number(socialPerformanceData.salesmanId),
            socialId: typeof socialPerformanceData.socialId === 'object' ?
                Number(socialPerformanceData.socialId.value) + this.currentCounter++ :
                Number(socialPerformanceData.socialId) + this.currentCounter++,
            description: typeof socialPerformanceData.description === 'object' ?
                String(socialPerformanceData.description.value) :
                String(socialPerformanceData.description),
            targetValue: typeof socialPerformanceData.targetValue === 'object' ?
                Number(socialPerformanceData.targetValue.value) :
                Number(socialPerformanceData.targetValue),
            actualValue: typeof socialPerformanceData.actualValue === 'object' ?
                Number(socialPerformanceData.actualValue.value) :
                Number(socialPerformanceData.actualValue),
            year: typeof socialPerformanceData.year === 'object' ?
                Number(socialPerformanceData.year.value) :
                Number(socialPerformanceData.year)
        };

        this.http.post(
            environment.apiEndpoint + '/api/salesmen/performance/create',
            payload,
            {observe: 'response', withCredentials: true}
        ).subscribe();
    }
}
