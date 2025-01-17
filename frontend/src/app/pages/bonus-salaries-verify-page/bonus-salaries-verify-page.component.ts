import { Component, OnInit } from '@angular/core';
import { SalesmanInterface } from '../../interfaces/salesman-interface';
import { SalesmenStateService } from '../../services/salesmen-state.service';
import { BonusSalaryRecordInterface } from '../../interfaces/bonus-salary-record-interface';
import { Router } from '@angular/router';

interface BonusTableRow {
    salesmanId: number;
    employeeId: string;
    name: string;
    totalBonus: number;
    targetValue: number;
    actualValue: number;
    accepted: boolean;
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
    isLoading = false;

    constructor(
        private router: Router,
        private salesmenStateService: SalesmenStateService, ) {
        // Default value for year picker is current year (2025)
        const currentYear = new Date().getFullYear();
        this.years = Array.from({length: 25}, (_, i): number => currentYear - i);
        this.selectedYear = currentYear;
    }

    ngOnInit(): void {
        this.loadBonusData();
    }

    loadBonusData(): void {
        this.isLoading = true;
        const salesmen = this.salesmenStateService.getSalesmen();

        this.dataSource = salesmen.map((salesman: SalesmanInterface): BonusTableRow => {
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
                accepted: false
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

    acceptBonus(salesmanId: number): void {
        const index = this.dataSource.findIndex((row): boolean => row.salesmanId === salesmanId);
        if (index !== -1) {
            this.dataSource[index].accepted = true;
        }
    }
}
