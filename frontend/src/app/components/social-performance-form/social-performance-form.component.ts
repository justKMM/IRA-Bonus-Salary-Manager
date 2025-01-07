import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-social-performance-form',
    templateUrl: './social-performance-form.component.html',
    styleUrls: ['./social-performance-form.component.css']
})
export class SocialPerformanceFormComponent {
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<SocialPerformanceFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {salesmanId: string}
    ) {
        this.form = this.fb.group({
            leadershipScore: [''],
            opennessScore: [''],
            socialBehaviorScore: [''],
            communicationScore: [''],
            integrityScore: [''],
            comments: ['']
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }

}
