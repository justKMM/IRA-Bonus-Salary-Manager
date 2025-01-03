import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesManInterface } from '../interfaces/salesman-interface';
import { environment } from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {BonusSalaryRecordInterface} from '../interfaces/bonus-salary-record-interface';

@Injectable({
    providedIn: 'root'
})
export class SalesmenService {
    constructor(private http: HttpClient) { }

    getSalesMen(): Observable<HttpResponse<SalesManInterface[]>> {
        return this.http.get<BackendResponse[]>(environment.apiEndpoint + '/api/salesmen', {observe: 'response', withCredentials: true})
            .pipe(
                map((response: HttpResponse<BackendResponse[]>): HttpResponse<SalesManInterface[]> => {
                    // Filter out any null or undefined entries before mapping
                    const mappedData: SalesManInterface[] = response.body
                        .filter((res: BackendResponse): boolean => res !== null && res !== undefined)
                        .map((res: BackendResponse): SalesManInterface => ({
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
                        }));
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
}

interface BackendResponse {
    salesmanId: number;
    uid?: string;
    employeeId?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    bonusSalary: {
        bonuses: BonusSalaryRecordInterface[];
    };
    jobTitle: string;
    department: string;
    gender?: string;
}
