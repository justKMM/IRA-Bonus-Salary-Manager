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
        socialPerformanceData.socialId = Number(socialPerformanceData.socialId) + this.currentCounter++;
        const salesmanId = socialPerformanceData.salesmanId;
        const socialId = socialPerformanceData.socialId;
        const body = {
            salesmanId: socialPerformanceData.salesmanId,
            socialId: socialPerformanceData.socialId,
            description: socialPerformanceData.description,
            targetValue: socialPerformanceData.targetValue,
            actualValue: socialPerformanceData.actualValue,
            year: socialPerformanceData.year
        };
        this.http.post(
            environment.apiEndpoint + '/salesmen/performance/create',
            body,
            {observe: 'response', withCredentials: true}
        );
        this.http.put(
            environment.apiEndpoint + `/salesmen/performance/update/${{salesmanId}}/social/${{socialId}}`,
            body,
            {observe: 'response', withCredentials: true}
        );
        console.log('HTTP Request to backend made.');
    }
}
