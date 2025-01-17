import { Injectable } from '@angular/core';
import { SalesmanInterface } from '../interfaces/salesman-interface';
import { SalesmenService } from './salesmen.service';
import {HttpResponse} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class SalesmenStateService {
    private seniorSalesMen: SalesmanInterface[] = [];

    constructor(private salesmenService: SalesmenService) {}

    getSalesmen(): SalesmanInterface[] {
        return this.seniorSalesMen;
    }

    getSalesmanById(salesmanId: number): SalesmanInterface | undefined {
        return this.seniorSalesMen.find(
            (salesman: SalesmanInterface): boolean =>
                salesman.salesmanId === salesmanId
        );
    }

    setSalesmen(updatedSeniorSalesMen: SalesmanInterface[]): void {
        this.seniorSalesMen = updatedSeniorSalesMen;
    }

    fetchSalesmen(): void {
        this.salesmenService.querySalesmenFromBackend().subscribe({
            next: (response: HttpResponse<SalesmanInterface[]>): void => {
                if (response.status === 200 && response.body) {
                    this.setSalesmen(response.body);
                }
            },
            error: (error: Error): void => console.error(`Salesmen retrieval failed: ${error.message}`),
        });
    }
}
