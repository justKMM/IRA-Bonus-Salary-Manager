import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Salesman} from '../../models/Salesman';
import {BonusSalary} from '../../models/BonusSalary';
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
    salesman: Salesman | undefined;
    dataSource!: MatTableDataSource<BonusSalary>;
    columnsToDisplay = ['year', 'value', 'actions'];
    expandedElement: BonusSalary | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private salesmenStateService: SalesmenStateService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        // First check if data exists in state management store
        const salesman: Salesman = this.salesmenStateService.getSalesmanById(id);

        if (salesman) {
            this.loadSalesman(salesman);
        } else {
            // If not, fetch from service
            this.salesmenStateService.fetchSalesmen();
        }
    }

    private loadSalesman(salesman: Salesman | undefined): void {
        this.salesman = salesman;
        if (this.salesman?.bonusSalary) {
            const sortedData = [...this.salesman.bonusSalary]
                .sort((
                    firstBonusSalaryRecord: BonusSalary,
                    secondBonusSalaryRecord: BonusSalary
                ): number => secondBonusSalaryRecord.year - firstBonusSalaryRecord.year
                );
            this.dataSource = new MatTableDataSource(sortedData);
        }
    }

    editRecord(record: BonusSalary): void {
        console.log('Edit record:', record);
        // TODO: Implement edit logic
    }

    navigateToDashboard(): void {
        void this.router.navigate(['/dashboard']);
    }
}
