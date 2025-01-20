import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {UserService} from '../services/user.service';
import {map} from 'rxjs/operators';
import {User} from '../models/User';

@Directive({
    selector: '[appRoleAccess]'
})
export class RoleAccessDirective implements OnInit {
    @Input('appRoleAccess') allowedRoles: string[];

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.userService.getOwnUser().pipe(
            map((user: User): boolean => this.allowedRoles.includes(user?.role) || user.isAdmin)
        ).subscribe((hasAccess: boolean): void => {
            this.viewContainer.clear();
            if (hasAccess) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        });
    }
}
