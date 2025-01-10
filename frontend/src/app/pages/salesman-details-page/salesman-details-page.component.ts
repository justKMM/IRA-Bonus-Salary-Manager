import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SalesmanInterface} from '../../interfaces/salesman-interface';
import {SalesmenService} from '../../services/salesmen.service';
import {BonusSalaryRecordInterface} from '../../interfaces/bonus-salary-record-interface';
import {getSalesmanById, setSeniorSalesmen} from '../../../utils/GLOBALS';
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
        private salesmenService: SalesmenService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        // First check if data exists in GLOBALS
        const salesman: SalesmanInterface = getSalesmanById(id);

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
