import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SalesManInterface} from '../../interfaces/salesman-interface';
import {SalesmenService} from '../../services/salesmen.service';
import {BonusSalaryRecordInterface} from '../../interfaces/bonus-salary-record-interface';
import {getSalesmanById, setSeniorSalesmen} from '../../../utils/GLOBALS';

@Component({
    selector: 'app-salesman-details-page',
    templateUrl: './salesman-details-page.component.html',
    styleUrls: ['./salesman-details-page.component.css']
})
export class SalesmanDetailsPageComponent implements OnInit{
    salesman: SalesManInterface | undefined;
    sortedBonusRecords: BonusSalaryRecordInterface[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private salesmenService: SalesmenService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        // First check if data exists in GLOBALS
        const salesman = getSalesmanById(id);

        if (salesman) {
            this.loadSalesman(salesman);
        } else {
            // If not, fetch from service
            this.salesmenService.getSalesMen().subscribe((response): void => {
                if (response.body) {
                    setSeniorSalesmen(response.body);
                    this.loadSalesman(getSalesmanById(id));
                }
            });
        }
    }

    private loadSalesman(salesman: SalesManInterface | undefined): void {
        this.salesman = salesman;
        if (this.salesman?.bonusSalary?.bonuses) {
            this.sortedBonusRecords = [...this.salesman.bonusSalary.bonuses]
                .sort((firstBonusSalaryRecord, secondBonusSalaryRecord): number => {
                    return secondBonusSalaryRecord.year.localeCompare(firstBonusSalaryRecord.year);
                });
        }
    }

    navigateToDashboard(): void {
        void this.router.navigate(['/dashboard']);
    }
}
