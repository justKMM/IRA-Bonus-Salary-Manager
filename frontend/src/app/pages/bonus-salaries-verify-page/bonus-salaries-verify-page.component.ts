import {Component, OnInit} from '@angular/core';
import { Salesman } from '../../models/Salesman';
import { SalesmenStateService } from '../../services/salesmen-state.service';
import {UserService} from '../../services/user.service';
import {User, USER_ROLES} from '../../models/User';
import {EvaluationService} from '../../services/evaluation.service';
import {Evaluation} from '../../models/Evaluation';
import {HttpResponse} from '@angular/common/http';
import {SalesPerformance} from '../../models/SalesPerformance';
import {SocialPerformance} from '../../models/SocialPerformance';
import {MatTableDataSource} from '@angular/material/table';
class BonusSalaryRow {
    salesmanId: number;
    fullname: string;
    salesBonus: number;
    socialBonus: number;
    totalBonus: number;
    accepted: boolean;

    constructor(
        salesmanId: number,
        fullname: string,
        salesBonus: number,
        socialBonus: number,
        totalBonus: number,
        accepted: boolean,
    ) {
        this.salesmanId = salesmanId;
        this.fullname = fullname;
        this.salesBonus = salesBonus;
        this.socialBonus = socialBonus;
        this.totalBonus = totalBonus;
        this.accepted = accepted;
    }
}

@Component({
    selector: 'app-bonus-salaries-verify-page',
    templateUrl: './bonus-salaries-verify-page.component.html',
    styleUrls: ['./bonus-salaries-verify-page.component.css']
})
export class BonusSalariesVerifyPageComponent implements OnInit {
    displayedColumns: string[] = ['salesmanId', 'fullname', 'salesBonus', 'socialBonus', 'totalBonus', 'actions'];
    // The dataset for the table
    bonusSalaryRows = new MatTableDataSource<BonusSalaryRow>([]);
    evaluations: Evaluation[] = [];
    years: number[] = [];
    selectedYear = 2025;
    isLoading = true;
    user: User;

    constructor(
        private userService: UserService,
        private evaluationService: EvaluationService,
        private salesmenStateService: SalesmenStateService
    ) {
        const currentYear = new Date().getFullYear();
        this.years = Array.from({length: 25}, (_, i): number => currentYear - i);
        this.selectedYear = currentYear;
    }

    ngOnInit(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
            this.loadSalesmenByYear().catch((error): void => {
                console.error('Error loading salesmen:', error);
            });
        });
    }

    // Load the entire dataset (salesmen + bonuses)
    async loadSalesmenByYear(): Promise<void> {
        this.bonusSalaryRows.data = [];
        this.evaluations = [];
        let salesmen: Salesman[] = this.salesmenStateService.getSalesmen();
        // Filter the salesmen (for when the logged-in user is a salesman)
        if (this.user?.role === USER_ROLES.SALESMAN) {
            salesmen = salesmen.filter((salesman: Salesman): boolean =>
                (this.user?.username && salesman.salesmanId === Number(this.user.username))
            );
        }
        // Getting the evaluation of the corresponding year for the salesmen
        const promises = salesmen.map((salesman): Promise<HttpResponse<Evaluation>> =>
            this.evaluationService.getEvaluationBySalesmanIdAndYear(
                salesman.salesmanId,
                this.selectedYear
            ).toPromise()
        );

        try {
            const responses = await Promise.all(promises);
            responses.forEach((response): void => {
                if (response?.body) {
                    this.evaluations.push(response.body);
                    this.loadBonusData(response.body);
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            this.isLoading = false;
        }
    }
    // load the bonuses (sales, social, total)
    loadBonusData(evaluation: Evaluation): void {
        const totalSalesBonus: number = evaluation.salesEvaluation
            .reduce((sum: number, perf: SalesPerformance): number => sum + (perf.bonus || 0), 0);

        const totalSocialBonus: number = evaluation.socialEvaluation
            .reduce((sum: number, perf: SocialPerformance): number => sum + (perf.bonus || 0), 0);

        // State of accept button
        let accepted = true;
        if (this.user?.role === USER_ROLES.SALESMAN) {
            accepted = evaluation.acceptedSalesman;
        } else if (this.user?.role === USER_ROLES.HR) {
            accepted = evaluation.acceptedHR;
        } else if (this.user?.role === USER_ROLES.CEO) {
            accepted = evaluation.acceptedCEO;
        }

        this.bonusSalaryRows.data = [...this.bonusSalaryRows.data, {
            salesmanId: evaluation.salesmanId,
            fullname: evaluation.fullname,
            salesBonus: totalSalesBonus,
            socialBonus: totalSocialBonus,
            totalBonus: totalSalesBonus + totalSocialBonus,
            accepted
        }];
    }
    // Reacts on year change
    async onYearChange(): Promise<void> {
        await this.loadSalesmenByYear();
        console.log(`Evaluations: ${this.evaluations.length}`);
        console.log(`Bonus Salary Rows: ${this.bonusSalaryRows.data.length}`);
    }
    // Bonus accept action
    acceptBonus(event: MouseEvent, salesmanId: number): void {
        // Disabling the button on click
        const target = event.target as HTMLElement;
        const button = target.closest('button') ;
        if (button) {
            button.disabled = true;
        }
        const index = this.evaluations.findIndex((row): boolean => row.salesmanId === salesmanId);
        if (index !== -1) {
            switch (this.user?.role) {
            case 'hr':
                this.evaluationService.hrAcceptEvaluation(salesmanId, this.selectedYear)
                    .subscribe({
                        next: (): void => {
                            this.evaluations[index].acceptedHR = true;
                        },
                        error: (error): void => {
                            console.error('Error accepting HR evaluation:', error);
                        }
                    });
                break;
            case 'ceo':
                this.evaluationService.ceoAcceptEvaluation(salesmanId, this.selectedYear)
                    .subscribe({
                        next: (): void => {
                            this.evaluations[index].acceptedCEO = true;
                        },
                        error: (error): void => {
                            console.error('Error accepting CEO evaluation:', error);
                        }
                    });
                break;
            case 'salesman':
                this.evaluationService.salesmanAcceptEvaluation(salesmanId, this.selectedYear)
                    .subscribe({
                        next: (): void => {
                            this.evaluations[index].acceptedSalesman = true;
                        },
                        error: (error): void => {
                            console.error('Error accepting salesman evaluation:', error);
                        }
                    });
                break;
            default:
                console.log('User is not allowed to accept Bonuses.');
                break;
            }
        }
    }
    // For an accepted evaluation
    getSuccessMessage(role?: string): string {
        switch (role) {
        case USER_ROLES.HR:
            return 'HR';
        case USER_ROLES.CEO:
            return 'CEO';
        case USER_ROLES.SALESMAN:
            return 'Accepted';
        default:
            return 'Unavailable';
        }
    }
    // Open pop up bonus details form
    viewDetails(salesmanId: number, totalBonus: number): void {
        this.evaluationService.openBonusDetailsDialog(salesmanId, this.selectedYear, totalBonus);
    }
}
