import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {SocialPerformance} from '../models/SocialPerformance';
import {SocialPerformancesForm} from '../models/SocialPerformancesForm';

@Injectable({
    providedIn: 'root'
})
export class SocialPerformanceService {

    constructor(
        private http: HttpClient,
    ) { }

    getSocialPerformanceBySalesmanId(salesmanId: number): Observable<HttpResponse<SocialPerformance[]>> {
        return this.http.get<SocialPerformance[]>(
            environment.apiEndpoint + `/api/salesmen/performance/${salesmanId}`,
            {observe: 'response', withCredentials: true}
        )
            .pipe(
                map
                ((
                    response: HttpResponse<SocialPerformance[]>
                ): HttpResponse<SocialPerformance[]> => {
                    // Filter out any null or undefined entries before mapping
                    const mappedData: SocialPerformance[] = response.body
                        .filter((res: SocialPerformance): boolean => res !== null && res !== undefined);
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

    createSocialPerformance(socialPerformanceData: SocialPerformancesForm): void {
        let counter = 1;
        for (const value of socialPerformanceData.values) {
            const payload = {
                salesmanId: socialPerformanceData.salesmanId.valueOf(),
                socialId: counter++,
                description: value.description,
                targetValue: value.targetValue,
                actualValue: value.actualValue,
                year: socialPerformanceData.year
            };

            this.http.post(
                environment.apiEndpoint + '/api/salesmen/performance/create',
                payload,
                {observe: 'response', withCredentials: true}
            ).subscribe({
                error: (error: HttpErrorResponse): void => {
                    if (error.status === 500
                        && typeof error.error === 'string'
                        && error.error.includes('duplicate key error')) {
                        // TODO: Error handling for submission of duplicated records
                    }
                }
            });
        }
    }
}
