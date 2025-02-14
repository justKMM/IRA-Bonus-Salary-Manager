import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {User} from '../models/User';
import {UserService} from './user.service';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BonusSalaryService {
    user: User;
    constructor(
        private http: HttpClient,
        private userService: UserService
    ) {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
            if (!this.user.role && !this.user.isAdmin) {
                console.error('Evaluation Service: User init failed');
            }
        });
    }

    postBonusSalaryToHrmBySalesmanId(salesmanId: number): Observable<any> {
        return this.http.post(
            environment.apiEndpoint + `/api/bonus/${salesmanId}`,
            {},
            {observe: 'response', withCredentials: true}
        ).pipe(
            tap((response): void => console.log('Bonus Salary Service: Response from Backend:', response)),
            catchError((error: HttpErrorResponse): Observable<never> => {
                console.error('Bonus Salary Service: Response from Backend:', error);
                return throwError((): HttpErrorResponse => error);
            })
        );
    }

    postAllBonusSalaryToHrmBySalesmanId(): Observable<any> {
        return this.http.post(
            environment.apiEndpoint + '/api/bonus',
            {},
            {observe: 'response', withCredentials: true}
        ).pipe(
            tap((response): void => console.log('Bonus Salary Service: Response from Backend:', response)),
            catchError((error: HttpErrorResponse): Observable<never> => {
                console.error('Bonus Salary Service: Response from Backend:', error);
                return throwError((): HttpErrorResponse => error);
            })
        );
    }
}
