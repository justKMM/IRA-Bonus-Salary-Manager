import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getSeniorSalesmen, setSeniorSalesmen } from '../../../utils/GLOBALS';
import {
    SocialPerformanceFormComponent
} from '../../components/social-performance-form/social-performance-form.component';
import { SalesmanInterface } from '../../interfaces/salesman-interface';
import { SalesmenService } from '../../services/salesmen.service';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {
    salesMenDisplayedColumns = ['id', 'code', 'fullName', 'jobTitle', 'socialPerformance', 'bonusSalary'];
    salesmen: SalesmanInterface[] = [];
    isLoading = true;

    constructor(
        private salesMenService: SalesmenService,
        private router: Router,
        private dialog: MatDialog
    ) { }

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

    addNewSocialPerformance(salesmanId: number): void {
        const dialogRef = this.dialog.open(SocialPerformanceFormComponent, {
            width: '400px',
            data: { salesmanId }
        });

        dialogRef.afterClosed().subscribe((result): void => {
            if (result) {
                // TODO: Handle form submission
                console.log(result);
            }
        });
    }

    editSalesman(salesmanId: number): void {
        void this.router.navigate(['/salesmen', salesmanId]);
    }
}
