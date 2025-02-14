import { Injectable } from '@angular/core';
import {User} from '../models/User';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {UserService} from './user.service';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Evaluation} from '../models/Evaluation';
import {MatDialog} from '@angular/material/dialog';
import {BonusDetailsFormComponent} from '../components/bonus-details-form/bonus-details-form.component';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EvaluationService {
    user: User;
    constructor(
        private http: HttpClient,
        private dialog: MatDialog,
        private userService: UserService
    ) {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
            if (!this.user.role && !this.user.isAdmin) {
                console.error('Evaluation Service: User init failed');
            }
        });
    }

    getEvaluationBySalesmanIdAndYear(salesmanId: number, year: number): Observable<HttpResponse<Evaluation>> {
        return this.http.get<Evaluation>(
            environment.apiEndpoint + `/api/evaluation/${salesmanId}/${year}`,
            {observe: 'response', withCredentials: true}
        ).pipe(
            tap((response): void => console.log('Evaluation Service: Response from Backend:', response)),
            catchError((error: HttpErrorResponse): Observable<never> => {
                console.error('Evaluation Service: Response from Backend:', error);
                return throwError((): HttpErrorResponse => error);
            })
        );
    }

    deleteEvaluationBySalesmanIdAndYear(salesmanId: number, year: number): Observable<any> {
        console.log(`Deleting old evaluation of salesman ${salesmanId}, year: ${year}`);
        return this.http.delete(
            environment.apiEndpoint + `/api/evaluation/${salesmanId}/${year}`,
            {observe: 'response', withCredentials: true}
        ).pipe(
            tap((response): void => console.log('Evaluation Service: Response from Backend:', response)),
            catchError((error: HttpErrorResponse): Observable<never> => {
                console.error('Evaluation Service: Response from Backend:', error);
                return throwError((): HttpErrorResponse => error);
            })
        );
    }

    salesmanAcceptEvaluation(salesmanId: number, year: number): Observable<any> {
        return this.http.put(
            environment.apiEndpoint + `/api/evaluation/acceptSalesman/${salesmanId}/${year}`,
            {},
            {observe: 'response', withCredentials: true}
        );
    }

    hrAcceptEvaluation(salesmanId: number, year: number): Observable<any> {
        return this.http.put(
            environment.apiEndpoint + `/api/evaluation/acceptHR/${salesmanId}/${year}`,
            {},
            {observe: 'response', withCredentials: true}
        );
    }

    ceoAcceptEvaluation(salesmanId: number, year: number): Observable<any> {
        return this.http.put(
            environment.apiEndpoint + `/api/evaluation/acceptCEO/${salesmanId}/${year}`,
            {},
            {observe: 'response', withCredentials: true}
        );
    }

    updateRemarkOfEvaluationBySalesmanIdAndYear(salesmanId: number, year: number, remark: string): Observable<any> {
        return this.http.put(
            environment.apiEndpoint + `/api/evaluation/update/${salesmanId}/${year}`,
            {
                remark,
            },
            {observe: 'response', withCredentials: true}
        );
    }

    openBonusDetailsDialog(salesmanId: number, year: number, totalBonus: number): void {
        this.dialog.open(BonusDetailsFormComponent, {
            width: '90%',
            maxWidth: '800px',
            data: { salesmanId, year, totalBonus }
        });
    }
}
