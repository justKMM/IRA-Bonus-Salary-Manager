import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SocialPerformanceService} from '../../services/social-performance.service';
import {SocialPerformanceInterface} from '../../interfaces/social-performance-interface';

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
        private socialPerformanceService: SocialPerformanceService,
        @Inject(MAT_DIALOG_DATA) public data: {salesmanId: number}
    ) {
        this.form = this.fb.group({
            year: 0,
            leadershipScore: 0,
            opennessScore: 0,
            socialBehaviorScore: 0,
            communicationScore: 0,
            integrityScore: 0,
            targetValue: 20,
            actualValue: [{value: 0, disabled: true}],
            comments: ''
        });

        // Update actualValue when any score changes
        const scoreControls = ['leadershipScore', 'opennessScore', 'socialBehaviorScore',
            'communicationScore', 'integrityScore'];
        scoreControls.forEach((controlName: string): void => {
            this.form.get(controlName)?.valueChanges.subscribe((): void => {
                const sum = scoreControls.reduce((total: number, score: string): number =>
                    total + Number(this.form.get(score)?.value || 0), 0);
                this.form.patchValue({actualValue: sum}, {emitEvent: false});
            });
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            const socialPerformanceData: SocialPerformanceInterface = {
                salesmanId: this.data.salesmanId,
                socialId: this.form.get('year'),
                description: this.form.get('comments'),
                targetValue: this.form.get('targetValue'),
                actualValue: this.form.get('actualValue'),
                year: this.form.get('year'),
            };
            this.socialPerformanceService.createSocialPerformance(socialPerformanceData);
            this.dialogRef.close(this.form.value);
        }
    }

}
