import { Injectable } from '@angular/core';
import { Salesman } from '../models/Salesman';
import { SalesmenService } from './salesmen.service';
import {HttpResponse} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SalesmenStateService {
    private seniorSalesMen: Salesman[] = [];

    constructor(private salesmenService: SalesmenService) {}

    getSalesmen(): Salesman[] {
        return this.seniorSalesMen;
    }

    getSalesmanById(salesmanId: number): Salesman | undefined {
        return this.seniorSalesMen.find(
            (salesman: Salesman): boolean =>
                salesman.salesmanId === salesmanId
        );
    }

    setSalesmen(updatedSeniorSalesMen: Salesman[]): void {
        this.seniorSalesMen = updatedSeniorSalesMen;
    }

    fetchSalesmen(): void {
        this.salesmenService.querySalesmenFromBackend().subscribe({
            next: (response: HttpResponse<Salesman[]>): void => {
                if (response.status === 200 && response.body) {
                    this.setSalesmen(response.body);
                }
            },
            error: (error: Error): void => console.error(`Salesmen retrieval failed: ${error.message}`),
        });
    }
}
