import { Component, OnInit } from '@angular/core';
import {SalesManInterface} from '../../interfaces/salesman-interface';
import {SalesmenService} from '../../services/salesmen.service';
import { getSeniorSalesMen, setSeniorSalesMen } from "../../../utils/GLOBALS";

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent {
    salesMenDisplayedColumns = ['id', 'code', 'fullName', 'jobTitle'];
    salesmen: SalesManInterface[] = [];

    constructor(private salesMenService: SalesmenService) {}

    ngOnInit(): void {
        if (getSeniorSalesMen().length < 1) {
            this.fetchSalesMen();
        }
        this.salesmen = getSeniorSalesMen();
        console.log(`salesmen: ${this.salesmen}, getSalesmen: ` + getSeniorSalesMen());
    }

    fetchSalesMen(): void {
        this.salesMenService.getSalesMen().subscribe((response): void => {
            if (response.status === 200){
                setSeniorSalesMen(response.body);
            } else console.error('Salesmen retrieval unsuccessful');
        });
    }
}
