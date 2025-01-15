import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserPageComponent } from './pages/add-user-page/add-user-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ExamplePageComponent } from './pages/example-page/example-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SalesmanDetailsPageComponent } from './pages/salesman-details-page/salesman-details-page.component';
import { AuthGuardService } from './services/auth-guard.service';

/*
  This array holds the relation of paths and components which angular router should resolve.

  If you want add a new page with a separate path/subdirectory you should register it here.
  It is also possible to read parameters from the path they have to be specified with ':' in the path.

  If a new page should also show up in the menu bar, you need to add it there too.
  Look at: frontend/src/app/components/menu-bar/menu-bar.component.ts
 */
const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'example', component: ExamplePageComponent, canActivate: [AuthGuardService] },
    { path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuardService] },
    { path: 'add-user', component: AddUserPageComponent, canActivate: [AuthGuardService] },
    { path: 'salesmen/:id', component: SalesmanDetailsPageComponent, canActivate: [AuthGuardService] },
    { path: '', component: LandingPageComponent, canActivate: [AuthGuardService] },
    { path: '**', component: NotFoundPageComponent } // these entries are matched from top to bottom => not found should be the last entry
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRouting { }
