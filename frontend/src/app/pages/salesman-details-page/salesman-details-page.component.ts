import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SalesManInterface} from '../../interfaces/salesman-interface';
import {BonusSalaryRecordInterface} from '../../interfaces/bonus-salary-record-interface';
import {getSalesmanById} from '../../../utils/GLOBALS';

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
        private router: Router
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.salesman = getSalesmanById(id);

        if (this.salesman?.bonusSalary?.bonuses) {
            this.sortedBonusRecords = [...this.salesman.bonusSalary.bonuses]
                // eslint-disable-next-line arrow-body-style
                .sort((bonusSalaryRecord1: BonusSalaryRecordInterface, bonusSalaryRecord2: BonusSalaryRecordInterface): number => {
                    return bonusSalaryRecord2.year.localeCompare(bonusSalaryRecord1.year);
                });
        }
    }

    navigateToDashboard(): void {
        void this.router.navigate(['/dashboard']);
    }
}
