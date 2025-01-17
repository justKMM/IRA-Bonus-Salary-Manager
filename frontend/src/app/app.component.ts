import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {SalesmenStateService} from './services/salesmen-state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    isLoggedIn: boolean;

    constructor(
        private authService: AuthService,
        private salesmenStateService: SalesmenStateService, ) {
    }

    ngOnInit(): void {
        this.authService.subscribeLoginChange((newState: boolean): void => { this.isLoggedIn = newState; });
        this.authService.isLoggedIn().subscribe();
        if (this.salesmenStateService.getSalesmen().length < 1) {
            this.salesmenStateService.fetchSalesmen();
        }
    }
}
