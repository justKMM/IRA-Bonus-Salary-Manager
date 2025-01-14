import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { UserInterface, USER_ROLES } from '../../interfaces/user-interface';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-add-user-page',
    templateUrl: './add-user-page.component.html',
    styleUrls: ['./add-user-page.component.css']
})
export class AddUserPageComponent implements OnInit {
    userForm: FormGroup<{
        username: FormControl<string>;
        firstname: FormControl<string>;
        lastname: FormControl<string>;
        email: FormControl<string>;
        password: FormControl<string>;
        isAdmin: FormControl<boolean>;
        role: FormControl<UserInterface['role']>;
    }>;
    roles = Object.values(USER_ROLES);

    constructor(
        private fb: FormBuilder,
        private userService: UserService
    ) {
        this.userForm = this.fb.group({
            username: new FormControl('', {
                // validators: [Validators.minLength(3)],
                nonNullable: true
            }),
            firstname: new FormControl('', {
                // validators: [],
                nonNullable: true
            }),
            lastname: new FormControl('', {
                // validators: [],
                nonNullable: true
            }),
            email: new FormControl('', {
                // validators: [],
                nonNullable: false
            }),
            password: new FormControl('', {
                // validators: [Validators.minLength(6)],
                nonNullable: true
            }),
            isAdmin: new FormControl(false, { nonNullable: true }),
            role: new FormControl('' as UserInterface['role'], {
                // validators: [],
                nonNullable: true
            })
        });
    }

    ngOnInit(): void {}

    onSubmit(): void {
        if (this.userForm.valid) {
            const newUser: UserInterface = {
                username: this.userForm.get('username')?.value,
                firstname: this.userForm.get('firstname')?.value,
                lastname: this.userForm.get('lastname')?.value,
                email: this.userForm.get('email')?.value,
                password: this.userForm.get('password')?.value,
                isAdmin: this.userForm.get('isAdmin')?.value || false,
                role: this.userForm.get('role')?.value
            };
            this.userService.createNewUser(newUser).subscribe(
                (response): void => {
                    console.log('User created successfully', response);
                    this.userForm.reset();
                },
                (error): void => {
                    console.error('Error creating user', error);
                }
            );
        }
    }
}
