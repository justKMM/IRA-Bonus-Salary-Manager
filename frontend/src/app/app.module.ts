import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { LoginComponent } from './components/login/login.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { SocialPerformanceFormComponent } from './components/social-performance-form/social-performance-form.component';
import { BasicAuthInterceptor } from './interceptors/basic-auth.interceptor';
import { AddUserPageComponent } from './pages/add-user-page/add-user-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ExamplePageComponent } from './pages/example-page/example-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SalesmanDetailsPageComponent } from './pages/salesman-details-page/salesman-details-page.component';

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
        AddUserPageComponent,
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
        MatDatepickerModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatCheckboxModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BasicAuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
