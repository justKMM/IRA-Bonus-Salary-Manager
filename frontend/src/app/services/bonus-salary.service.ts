import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UserService} from './user.service';
import {User, USER_ROLES} from '../models/User';

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
        });
        if (!this.user.role) {
            console.error('Bonus Salary Service: User init failed');
        }
    }

    salesmanVerifyBonusSalary(salesmanId: number, year: number): Observable<any> {
        if (this.user.role !== USER_ROLES.SALESMAN) {
            console.error('Bonus Salary Service: User not salesman');
            return;
        }
        return this.http.put(
            environment.apiEndpoint + `/api/evaluation/acceptSalesman/${salesmanId}/${year}`,
            {observe: 'response', withCredentials: true}
        );
    }

    hrVerifyBonusSalary(salesmanId: number, year: number): Observable<any> {
        if (this.user.role !== USER_ROLES.HR) {
            console.error('Bonus Salary Service: User not HR');
            return;
        }
        return this.http.put(
            environment.apiEndpoint + `/api/evaluation/acceptHR/${salesmanId}/${year}`,
            {observe: 'response', withCredentials: true}
        );
    }

    ceoVerifyBonusSalary(salesmanId: number, year: number): Observable<any> {
        if (this.user.role !== USER_ROLES.CEO) {
            console.error('Bonus Salary Service: User not CEO');
            return;
        }
        return this.http.put(
            environment.apiEndpoint + `/api/evaluation/acceptCEO/${salesmanId}/${year}`,
            {observe: 'response', withCredentials: true}
        );
    }
}
