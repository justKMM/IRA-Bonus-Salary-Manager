import { Injectable } from '@angular/core';
import {User, USER_ROLES} from '../models/User';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UserService} from './user.service';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Evaluation} from '../models/Evaluation';

@Injectable({
    providedIn: 'root'
})
export class EvaluationService {
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

    getEvaluationBySalesmanIdAndYear(salesmanId: number, year: number): Observable<HttpResponse<Evaluation>> {
        return this.http.get<Evaluation>(
            environment.apiEndpoint + `/api/evaluation/${salesmanId}/${year}`,
            {observe: 'response', withCredentials: true}
        );
    }

    salesmanAcceptEvaluation(salesmanId: number, year: number): Observable<any> {
        if (this.user.role !== USER_ROLES.SALESMAN) {
            console.error('Evaluation Service: User not salesman');
            return;
        }
        return this.http.put(
            environment.apiEndpoint + `/api/evaluation/acceptSalesman/${salesmanId}/${year}`,
            {observe: 'response', withCredentials: true}
        );
    }

    hrAcceptEvaluation(salesmanId: number, year: number): Observable<Object> {
        if (this.user.role !== USER_ROLES.HR) {
            console.error('Evaluation Service: User not HR');
            return;
        }
        return this.http.put(
            environment.apiEndpoint + `/api/evaluation/acceptHR/${salesmanId}/${year}`,
            {observe: 'response', withCredentials: true}
        );
    }

    ceoAcceptEvaluation(salesmanId: number, year: number): Observable<any> {
        if (this.user.role !== USER_ROLES.CEO) {
            console.error('Evaluation Service: User not CEO');
            return;
        }
        return this.http.put(
            environment.apiEndpoint + `/api/evaluation/acceptCEO/${salesmanId}/${year}`,
            {observe: 'response', withCredentials: true}
        );
    }
}
