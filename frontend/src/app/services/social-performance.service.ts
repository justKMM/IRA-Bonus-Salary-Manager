import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {IndividualSocialPerformanceInterface} from '../interfaces/individual-social-performance-interface';
import {SocialPerformanceFormInterface} from "../interfaces/social-performance-form-interface";

@Injectable({
    providedIn: 'root'
})
export class SocialPerformanceService {

    constructor(private http: HttpClient) { }
    private currentCounter = 0;

    getSocialPerformanceBySalesmanId(salesmanId: number): Observable<HttpResponse<IndividualSocialPerformanceInterface[]>> {
        return this.http.get<IndividualSocialPerformanceInterface[]>(
            environment.apiEndpoint + `/api/salesmen/performance/${salesmanId}`,
            {observe: 'response', withCredentials: true}
        )
            .pipe(
                map
                ((
                    response: HttpResponse<IndividualSocialPerformanceInterface[]>
                ): HttpResponse<IndividualSocialPerformanceInterface[]> => {
                    // Filter out any null or undefined entries before mapping
                    const mappedData: IndividualSocialPerformanceInterface[] = response.body
                        .filter((res: IndividualSocialPerformanceInterface): boolean => res !== null && res !== undefined);
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

    createSocialPerformance(socialPerformanceData: SocialPerformanceFormInterface): void {
        for (const value of socialPerformanceData.values) {
            const payload = {
                salesmanId: socialPerformanceData.salesmanId.valueOf(),
                socialId: socialPerformanceData.socialId.valueOf(),
                description: value.description,
                targetValue: value.targetValue,
                actualValue: value.actualValue,
                year: socialPerformanceData.year.valueOf()
            };

            this.http.post(
                environment.apiEndpoint + '/api/salesmen/performance/create',
                payload,
                {observe: 'response', withCredentials: true}
            ).subscribe();
        }
    }
}
