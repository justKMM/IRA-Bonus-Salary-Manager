import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SalesmenStateService } from '../../services/salesmen-state.service';
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
    salesMenDisplayedColumns = ['id', 'code', 'fullName', 'jobTitle', 'socialPerformance', 'details'];
    salesmen: SalesmanInterface[] = [];
    isLoading = true;

    constructor(
        private salesMenService: SalesmenService,
        private salesmenStateService: SalesmenStateService,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.salesmen = this.salesmenStateService.getSalesmen();
        if (this.salesmen.length < 1) {
            this.salesmenStateService.fetchSalesmen();
            this.salesmen = this.salesmenStateService.getSalesmen();
        }
        this.isLoading = false;
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
