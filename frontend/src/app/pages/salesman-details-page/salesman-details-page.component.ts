import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SalesmanInterface} from '../../interfaces/salesman-interface';
import {BonusSalaryRecordInterface} from '../../interfaces/bonus-salary-record-interface';
import { SalesmenStateService } from '../../services/salesmen-state.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';

@Component({
    selector: 'app-salesman-details-page',
    templateUrl: './salesman-details-page.component.html',
    styleUrls: ['./salesman-details-page.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class SalesmanDetailsPageComponent implements OnInit{
    salesman: SalesmanInterface | undefined;
    dataSource!: MatTableDataSource<BonusSalaryRecordInterface>;
    columnsToDisplay = ['year', 'value', 'actions'];
    expandedElement: BonusSalaryRecordInterface | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private salesmenStateService: SalesmenStateService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        // First check if data exists in state management store
        const salesman: SalesmanInterface = this.salesmenStateService.getSalesmanById(id);

        if (salesman) {
            this.loadSalesman(salesman);
        } else {
            // If not, fetch from service
            this.salesmenStateService.fetchSalesmen();
        }
    }

    private loadSalesman(salesman: SalesmanInterface | undefined): void {
        this.salesman = salesman;
        if (this.salesman?.bonusSalary) {
            const sortedData = [...this.salesman.bonusSalary]
                .sort((
                    firstBonusSalaryRecord: BonusSalaryRecordInterface,
                    secondBonusSalaryRecord: BonusSalaryRecordInterface
                ): number => secondBonusSalaryRecord.year - firstBonusSalaryRecord.year
                );
            this.dataSource = new MatTableDataSource(sortedData);
        }
    }

    editRecord(record: BonusSalaryRecordInterface): void {
        console.log('Edit record:', record);
        // TODO: Implement edit logic
    }

    navigateToDashboard(): void {
        void this.router.navigate(['/dashboard']);
    }
}
