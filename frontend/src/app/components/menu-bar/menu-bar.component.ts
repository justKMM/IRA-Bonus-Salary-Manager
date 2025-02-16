import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, USER_ROLES } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

    user: User;

    /*
    This array holds the definition of the menu's buttons. The "roles" are the ones allowed to see the buttons
   */
    buttons = [
        { title: 'Home', routerLink: '', roles: [USER_ROLES.ADMIN, USER_ROLES.CEO, USER_ROLES.HR, USER_ROLES.SALESMAN] },
        { title: 'Dashboard', routerLink: 'dashboard', roles: [USER_ROLES.ADMIN, USER_ROLES.HR] },
        {
            title: 'Verify Bonuses',
            routerLink: 'verify-bonus-salaries',
            roles: [
                USER_ROLES.ADMIN,
                USER_ROLES.CEO,
                USER_ROLES.HR,
                USER_ROLES.SALESMAN
            ]
        },
        { title: 'Add User', routerLink: 'add-user', roles: [USER_ROLES.ADMIN] },
    ];

    /**
     * The following parameters specify objects, which will be provided by dependency injection
     *
     * @param authService
     * @param router
     * @param userService
     */
    constructor(
        private authService: AuthService,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.fetchUser();
    }

    /**
     * function which handles clicking the logout button
     */
    handleLogout(): void {
        this.authService.logout().subscribe();
        void this.router.navigate(['login']); // after logout go back to the login-page
    }

    /**
     * fetches information about logged-in user
     */
    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }
}
