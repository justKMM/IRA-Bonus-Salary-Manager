import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserInterface} from '../interfaces/user-interface';
import {UserService} from './user.service';
import {User} from '../models/User';

@Injectable({
    providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
    private user: User;
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const allowedRoles = route.data.roles as Array<UserInterface['role']>;

        return this.userService.getOwnUser().pipe(
            map((user: User): boolean => {
                if (!user) { return false; }
                const hasAccess = allowedRoles.includes(user.role) || user.isAdmin;
                if (!hasAccess) {
                    void this.router.navigate(['/unauthorized']);
                }
                return hasAccess;
            })
        );
    }

    /**
     * fetches information about logged-in user
     */
    fetchUser(): void{
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }
}
