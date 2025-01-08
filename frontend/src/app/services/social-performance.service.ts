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
    private currentSocialId = 0;
    private currentTargetValue = 20;

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
                        /* .map((res: SalesmanInterface): SalesmanInterface => ({
                            salesmanId: res.salesmanId,
                            uid: res.uid,
                            employeeId: res.employeeId,
                            firstName: res.firstName,
                            middleName: res.middleName,
                            lastName: res.lastName,
                            bonusSalary: res.bonusSalary,
                            jobTitle: res.jobTitle,
                            department: res.department,
                            gender: res.gender
                        }));*/
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

    createSocialPerformance(salesmanId: number, year: number, value: number, description: string): void {
        this.http.post(
            environment.apiEndpoint + '/salesmen/performance/create',
            {
                salesmanId,
                socialId: this.currentSocialId++,
                description,
                targetValue: this.currentTargetValue,
                year,
            },
            {observe: 'response', withCredentials: true}
        );
    }
}
