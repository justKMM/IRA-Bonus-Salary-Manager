import { Component, OnInit } from '@angular/core';
import {SalesManInterface} from '../../interfaces/salesman-interface';
import {SalesmenService} from '../../services/salesmen.service';
import { getSeniorSalesMen, setSeniorSalesMen } from '../../../utils/GLOBALS';
import {Router} from '@angular/router';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent {
    salesMenDisplayedColumns = ['id', 'code', 'fullName', 'jobTitle', 'actions'];
    salesmen: SalesManInterface[] = [];
    isLoading = true;

    constructor(
        private salesMenService: SalesmenService,
        private router: Router
    ) {}

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        if (getSeniorSalesMen().length < 1) {
            this.fetchSalesMen();
        } else {
            this.salesmen = getSeniorSalesMen();
            this.isLoading = false;
        }
    }

    fetchSalesMen(): void {
        this.salesMenService.getSalesMen().subscribe({
            next: (response): void => {
                if (response.status === 200) {
                    setSeniorSalesMen(response.body);
                    this.salesmen = response.body;
                }
            },
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            error: (error): void => console.error(`Salesmen retrieval unsuccessful. Error: ${error}`),
            complete: (): boolean => this.isLoading = false
        });
    }

    editSalesman(sid: number): void {
        void this.router.navigate(['/salesmen/edit', sid]);
    }
}
