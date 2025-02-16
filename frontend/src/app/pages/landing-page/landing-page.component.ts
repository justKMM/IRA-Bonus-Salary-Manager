import { Component, OnInit } from '@angular/core';
import {BonusSalary} from '../../models/BonusSalary';
import {Salesman} from '../../models/Salesman';
import {SalesmenStateService} from '../../services/salesmen-state.service';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    salesmen: Salesman[];
    bonusData: Map<number, BonusSalary[]>;
    isLoading = true;

    constructor(
        private salesmenStateService: SalesmenStateService,
    ) { }

    ngOnInit(): void {
        this.salesmen = this.salesmenStateService.getSalesmen();
        if (this.salesmen.length < 1) {
            this.salesmenStateService.fetchSalesmen();
            this.salesmen = this.salesmenStateService.getSalesmen();
        }
        this.bonusData = new Map<number, BonusSalary[]>(
            this.salesmen
                .map((salesman): [number, BonusSalary[]] => [
                    salesman.salesmanId,
                    salesman.bonusSalary || []
                ])
        );
        this.isLoading = false;
    }

}
