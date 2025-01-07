import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { ExamplePageComponent } from './pages/example-page/example-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import {MatTableModule} from '@angular/material/table';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SalesmanDetailsPageComponent } from './pages/salesman-details-page/salesman-details-page.component';
import { SocialPerformanceFormComponent } from './components/social-performance-form/social-performance-form.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        LoginComponent,
        LandingPageComponent,
        MenuBarComponent,
        ExamplePageComponent,
        NotFoundPageComponent,
        DashboardPageComponent,
        SalesmanDetailsPageComponent,
        SocialPerformanceFormComponent,
    ],
    imports: [
        BrowserModule,
        AppRouting,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
