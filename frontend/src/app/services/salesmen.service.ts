import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salesman } from '../models/Salesman';
import { environment } from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SalesmenService {
    constructor(private http: HttpClient) { }

    querySalesmenFromBackend(): Observable<HttpResponse<Salesman[]>> {
        return this.http.get<Salesman[]>(
            environment.apiEndpoint + '/api/salesmen',
            {observe: 'response', withCredentials: true}
        )
            .pipe(
                map((response: HttpResponse<Salesman[]>): HttpResponse<Salesman[]> => {
                    // Filter out any null or undefined entries before mapping
                    const mappedData: Salesman[] = response.body
                        .filter((res: Salesman): boolean => res !== null && res !== undefined);
                        /* .map((res: Salesman): Salesman => ({
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
}
