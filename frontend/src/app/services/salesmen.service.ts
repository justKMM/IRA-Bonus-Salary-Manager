import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesmanInterface } from '../interfaces/salesman-interface';
import { environment } from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SalesmenService {
    constructor(private http: HttpClient) { }

    querySalesmenFromBackend(): Observable<HttpResponse<SalesmanInterface[]>> {
        return this.http.get<SalesmanInterface[]>(
            environment.apiEndpoint + '/api/salesmen',
            {observe: 'response', withCredentials: true}
        )
            .pipe(
                map((response: HttpResponse<SalesmanInterface[]>): HttpResponse<SalesmanInterface[]> => {
                    // Filter out any null or undefined entries before mapping
                    const mappedData: SalesmanInterface[] = response.body
                        .filter((res: SalesmanInterface): boolean => res !== null && res !== undefined);
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
}
