import { Component, OnInit } from '@angular/core';
import { SalesmanInterface } from '../../interfaces/salesman-interface';
import { SalesmenStateService } from '../../services/salesmen-state.service';
import { BonusSalaryRecordInterface } from '../../interfaces/bonus-salary-record-interface';
import { Router } from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/User';

interface BonusTableRow {
    salesmanId: number;
    employeeId: string;
    name: string;
    totalBonus: number;
    targetValue: number;
    actualValue: number;
    accepted: boolean;
    // Verifications
    hrVerified: boolean;
    ceoVerified: boolean;
    salesmanAccepted: boolean;
}

@Component({
    selector: 'app-bonus-salaries-verify-page',
    templateUrl: './bonus-salaries-verify-page.component.html',
    styleUrls: ['./bonus-salaries-verify-page.component.css']
})
export class BonusSalariesVerifyPageComponent implements OnInit {
    displayedColumns: string[] = ['employeeId', 'name', 'targetValue', 'actualValue', 'totalBonus', 'actions'];
    dataSource: BonusTableRow[] = [];
    years: number[] = [];
    selectedYear: number;
    isLoading = true;
    user: User;

    constructor(
        private userService: UserService,
        private router: Router,
        private salesmenStateService: SalesmenStateService, ) {
        // Default value for year picker is current year (2025)
        const currentYear = new Date().getFullYear();
        this.years = Array.from({length: 25}, (_, i): number => currentYear - i);
        this.selectedYear = currentYear;
    }

    ngOnInit(): void {
        this.fetchUser();
        this.loadBonusData();
    }

    loadBonusData(): void {
        const salesmen = this.salesmenStateService.getSalesmen();

        this.dataSource = salesmen
            // Filter for salesmen if current user is salesman
            .filter((salesman: SalesmanInterface): boolean =>
                this.user?.role !== 'salesman' ||
                (
                    !isNaN(Number(this.user?.username)) &&
                    salesman.salesmanId === Number(this.user?.username)
                )
            )
            .map((salesman: SalesmanInterface): BonusTableRow => {
                const yearBonuses = salesman.bonusSalary?.filter(
                    (bonus: BonusSalaryRecordInterface): boolean => bonus.year === this.selectedYear
                ) || [];

                const totalBonus = yearBonuses.reduce(
                    (sum, bonus): number => sum + bonus.bonus,
                    0
                );

                const totalTargetValue = yearBonuses.reduce(
                    (sum, bonus): number => sum + bonus.targetValue,
                    0
                );

                const totalActualValue = yearBonuses.reduce(
                    (sum, bonus): number => sum + bonus.actualValue,
                    0
                );

                return {
                    salesmanId: salesman.salesmanId,
                    employeeId: salesman.employeeId || '',
                    name: `${salesman.firstName} ${salesman.lastName}`,
                    totalBonus,
                    targetValue: totalTargetValue,
                    actualValue: totalActualValue,
                    accepted: false,
                    ceoVerified: false,
                    hrVerified: false,
                    salesmanAccepted: false,
                };
            });

        this.isLoading = false;
    }

    onYearChange(): void {
        this.loadBonusData();
    }

    viewDetails(salesmanId: number): void {
        void this.router.navigate(['/bonus-details', salesmanId, this.selectedYear]);
    }

    verify(salesmanId: number): void {
        const index = this.dataSource.findIndex((row): boolean => row.salesmanId === salesmanId);
        if (index !== -1) {
            switch (this.user?.role) {
            case 'hr':
                this.dataSource[index].hrVerified = true;
                break;
            case 'ceo':
                this.dataSource[index].ceoVerified = true;
                break;
            case 'salesman':
                this.dataSource[index].salesmanAccepted = true;
                break;
            }
        }
    }

    /**
     * fetches information about logged-in user
     */
    fetchUser(): void{
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }
}
