import {AfterContentInit, Component, OnInit} from '@angular/core';
import { Salesman } from '../../models/Salesman';
import { SalesmenStateService } from '../../services/salesmen-state.service';
import { BonusSalary } from '../../models/BonusSalary';
import { Router } from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/User';
import {EvaluationService} from '../../services/evaluation.service';
import {Evaluation} from '../../models/Evaluation';
import {HttpResponse} from '@angular/common/http';
import {EMPTY, from, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {SalesPerformance} from '../../models/SalesPerformance';
import {SocialPerformance} from '../../models/SocialPerformance';
class BonusSalaryRow {
    salesmanId: number;
    fullname: string;
    salesBonus: number;
    socialBonus: number;
    totalBonus: number;

    constructor(
        salesmanId: number,
        fullname: string,
        salesBonus: number,
        socialBonus: number,
        totalBonus: number
    ) {
        this.salesmanId = salesmanId;
        this.fullname = fullname;
        this.salesBonus = salesBonus;
        this.socialBonus = socialBonus;
        this.totalBonus = totalBonus;
    }
}

@Component({
    selector: 'app-bonus-salaries-verify-page',
    templateUrl: './bonus-salaries-verify-page.component.html',
    styleUrls: ['./bonus-salaries-verify-page.component.css']
})
export class BonusSalariesVerifyPageComponent implements OnInit, AfterContentInit {
    displayedColumns: string[] = ['salesmanId', 'fullname', 'salesBonus', 'socialBonus', 'totalBonus', 'actions'];
    bonusSalaryRows: BonusSalaryRow[] = [];
    evaluations: Evaluation[] = [];
    bonusSalaries: BonusSalary[] = [];
    years: number[] = [];
    selectedYear: number;
    isLoading = true;
    user: User;

    constructor(
        private userService: UserService,
        private evaluationService: EvaluationService,
        private router: Router,
        private salesmenStateService: SalesmenStateService
    ) {
        const currentYear = new Date().getFullYear();
        this.years = Array.from({length: 25}, (_, i): number => currentYear - i);
        this.selectedYear = currentYear;
    }

    ngOnInit(): void {
        this.fetchUser();
    }

    ngAfterContentInit(): void {
        this.bonusSalaryRows = [];
        this.isLoading = true;
    }

    loadSalesmenByYear(): void {
        this.bonusSalaryRows = [];
        this.evaluations = [];
        const salesmen: Salesman[] = this.salesmenStateService.getSalesmen();

        const filteredSalesmen: Salesman[] = salesmen.filter((salesman: Salesman): boolean =>
            this.user?.role !== 'salesman' ||
            (this.user?.username && salesman.salesmanId === Number(this.user.username))
        );

        filteredSalesmen.forEach((salesman: Salesman): void => {
            this.evaluationService.getEvaluationBySalesmanIdAndYear(
                salesman.salesmanId,
                this.selectedYear
            ).subscribe({
                next: (response: HttpResponse<Evaluation>): void => {
                    if (response?.body) {
                        this.evaluations.push(response.body);
                        this.loadBonusData(response.body);
                    }
                },
                error: (error: Error): void => console.error('Error loading evaluation:', error)
            });
        });

        this.isLoading = false;
    }

    loadBonusData(evaluation: Evaluation): void {
        const totalSalesBonus: number = evaluation.salesEvaluation
            .reduce((sum: number, perf: SalesPerformance): number => sum + (perf.bonus || 0), 0);

        const totalSocialBonus: number = evaluation.socialEvaluation
            .reduce((sum: number, perf: SocialPerformance): number => sum + (perf.bonus || 0), 0);

        this.bonusSalaryRows.push({
            salesmanId: evaluation.salesmanId,
            fullname: evaluation.fullname,
            salesBonus: totalSalesBonus,
            socialBonus: totalSocialBonus,
            totalBonus: totalSalesBonus + totalSocialBonus
        });
    }

    onYearChange(): void {
        this.loadSalesmenByYear();
    }

    acceptBonus(salesmanId: number): void {
        const index = this.evaluations.findIndex((row): boolean => row.salesmanId === salesmanId);
        if (index !== -1) {
            switch (this.user?.role) {
            case 'hr':
                this.evaluations[index].acceptedHR = true;
                this.evaluationService.hrAcceptEvaluation(salesmanId, this.selectedYear);
                break;
            case 'ceo':
                this.evaluations[index].acceptedCEO = true;
                this.evaluationService.ceoAcceptEvaluation(salesmanId, this.selectedYear);
                break;
            case 'salesman':
                this.evaluations[index].acceptedSalesman = true;
                this.evaluationService.salesmanAcceptEvaluation(salesmanId, this.selectedYear);
                break;
            }
        }
    }

    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }

    viewDetails(salesmanId: number): void {
        void this.router.navigate(['/bonus-details', salesmanId, this.selectedYear]);
    }
}
