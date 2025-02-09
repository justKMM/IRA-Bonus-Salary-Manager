import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SocialPerformanceService } from '../../services/social-performance.service';
import {SocialPerformanceFormInterface} from '../../interfaces/social-performance-form-interface';

@Component({
    selector: 'app-social-performance-form',
    templateUrl: './social-performance-form.component.html',
    styleUrls: ['./social-performance-form.component.css']
})
export class SocialPerformanceFormComponent {
    form: FormGroup;

    scores: number[] = [0, 1, 2, 3, 4, 5]; // Score options
    years: number[] = Array.from({ length: new Date().getFullYear() - 1950 + 1 }, (_, i): number => 1950 + i); // Year options

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<SocialPerformanceFormComponent>,
        private socialPerformanceService: SocialPerformanceService,
        @Inject(MAT_DIALOG_DATA) public data: { salesmanId: number }
    ) {
        this.form = this.fb.group({
            year: new Date().getFullYear(),
            // Actual values
            actualLeadershipScore: 0,
            actualOpennessScore: 0,
            actualSocialBehaviorScore: 0,
            actualCommunicationScore: 0,
            actualIntegrityScore: 0,
            // Target values
            targetLeadershipScore: 5,
            targetOpennessScore: 5,
            targetSocialBehaviorScore: 5,
            targetCommunicationScore: 5,
            targetIntegrityScore: 5,
            // Comments
            comments: ''
        });
    }

    onSubmit(): void {
        console.log('Form submitted');
        if (this.form.valid) {
            const socialPerformanceData: SocialPerformanceFormInterface = {
                salesmanId: this.data.salesmanId,
                socialId: this.form.get('year')?.value as number,
                values: [
                    // Leadership
                    {
                        description: 'leadership',
                        actualValue: this.form.get('actualLeadershipScore')?.value as number,
                        targetValue: this.form.get('targetLeadershipValue')?.value as number,
                    },
                    // Openness
                    {
                        description: 'openness',
                        actualValue: this.form.get('actualOpennessScore')?.value as number,
                        targetValue: this.form.get('targetOpennessScore')?.value as number,
                    },
                    // Social Behavior
                    {
                        description: 'social_behavior',
                        actualValue: this.form.get('actualSocialBehaviorScore')?.value as number,
                        targetValue: this.form.get('targetSocialBehaviorScore')?.value as number,
                    },
                    // Communication
                    {
                        description: 'communication',
                        actualValue: this.form.get('actualCommunicationScore')?.value as number,
                        targetValue: this.form.get('targetCommunicationScore')?.value as number,
                    },
                    // Integrity
                    {
                        description: 'integrity',
                        actualValue: this.form.get('actualIntegrityScore')?.value as number,
                        targetValue: this.form.get('targetIntegrityScore')?.value as number,
                    },
                ],
                year: this.form.get('year')?.value as number,
                comments: this.form.get('comments')?.value as string,
            };
            this.socialPerformanceService.createSocialPerformance(socialPerformanceData);
            this.dialogRef.close(this.form.value);
            console.log('Form created');
        }
    }

}
