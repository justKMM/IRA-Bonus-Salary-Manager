import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesManInterface } from '../interfaces/salesman-interface';
import { environment } from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SalesmenService {
    constructor(private http: HttpClient) { }

    getSalesMen(): Observable<HttpResponse<SalesManInterface[]>> {
        return this.http.get<HRMResponse[]>(environment.apiEndpoint + '/api/salesmen', {observe: 'response'})
            .pipe(
                map((response: HttpResponse<HRMResponse[]>): HttpResponse<SalesManInterface[]> => {
                    // Filter out any null or undefined entries before mapping
                    const mappedData: SalesManInterface[] = response.body
                        .filter((res: HRMResponse): boolean => res !== null && res !== undefined)
                        .map((res: HRMResponse): SalesManInterface => ({
                            sid: res.employeeId,
                            code: res.code,
                            fullName: res.firstName + ' ' + res.lastName,
                            jobTitle: res.jobTitle
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

interface HRMResponse {
    _id: string;
    firstName: string;
    lastName: string;
    code: string;
    employeeId: string;
    fullName: string;
    status: string | null;
    dob: string | null;
    driversLicenseNumber: string;
    licenseExpiryDate: string | null;
    maritalStatus: string;
    gender: string | null;
    otherId: string;
    nationality: string | null;
    unit: string | null;
    jobTitle: string;
    supervisor: string | null;
}
