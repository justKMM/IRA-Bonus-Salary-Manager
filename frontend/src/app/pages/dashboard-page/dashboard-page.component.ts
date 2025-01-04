import { Component, OnInit } from '@angular/core';
import {SalesManInterface} from '../../interfaces/salesman-interface';
import {SalesmenService} from '../../services/salesmen.service';
import { getSeniorSalesmen, setSeniorSalesmen } from '../../../utils/GLOBALS';
import {Router} from '@angular/router';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {
    salesMenDisplayedColumns = ['id', 'code', 'fullName', 'jobTitle', 'actions'];
    salesmen: SalesManInterface[] = [];
    isLoading = true;

    constructor(
        private salesMenService: SalesmenService,
        private router: Router
    ) {}

    ngOnInit(): void {
        if (getSeniorSalesmen().length < 1) {
            this.fetchSalesMen();
        } else {
            this.salesmen = getSeniorSalesmen();
            this.isLoading = false;
        }
    }

    fetchSalesMen(): void {
        this.salesMenService.getSalesMen().subscribe({
            next: (response): void => {
                if (response.status === 200) {
                    setSeniorSalesmen(response.body);
                    this.salesmen = getSeniorSalesmen();
                }
            },
            error: (error: Error): void => console.error(`Salesmen retrieval unsuccessful. Error: ${error.message}`),
            complete: (): boolean => this.isLoading = false
        });
    }

    editSalesman(sid: number): void {
        void this.router.navigate(['/salesmen', sid]);
    }
}
