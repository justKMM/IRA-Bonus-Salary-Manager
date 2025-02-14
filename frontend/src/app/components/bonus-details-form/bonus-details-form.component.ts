import {Component, Inject, OnInit} from '@angular/core';
import {Evaluation} from '../../models/Evaluation';
import {EvaluationService} from '../../services/evaluation.service';
import {HttpResponse} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../services/user.service';
import {USER_ROLES} from '../../models/User';

@Component({
    selector: 'app-bonus-details-form',
    templateUrl: './bonus-details-form.component.html',
    styleUrls: ['./bonus-details-form.component.css']
})
export class BonusDetailsFormComponent implements OnInit {
    salesmanId!: number;
    year!: number;
    totalBonus!: number;
    isVisible = true;
    evaluation: Evaluation;
    isEditing = false;
    editedRemark = '';
    userIsCeo = false;

    constructor(
        private evaluationService: EvaluationService,
        private userService: UserService,
        @Inject(MAT_DIALOG_DATA) public data: {
            salesmanId: number;
            year: number;
            totalBonus: number;
        },
        private dialogRef: MatDialogRef<BonusDetailsFormComponent>
    ) {
        this.salesmanId = data.salesmanId;
        this.year = data.year;
        this.totalBonus = data.totalBonus;
    }

    async ngOnInit(): Promise<void> {
        this.userService.getOwnUser().subscribe((user): void => {
            this.userIsCeo = (user.role === USER_ROLES.CEO);
        });
        await this.fetchEvaluation();
    }

    async fetchEvaluation(): Promise<void> {
        const promise: Promise<HttpResponse<Evaluation>> = this.evaluationService.getEvaluationBySalesmanIdAndYear(
            this.salesmanId,
            this.year
        ).toPromise();

        try {
            const response: HttpResponse<Evaluation> = await promise;
            if (response?.body) {
                this.evaluation = response.body;
            }
        } catch (error) {
            console.error(error);
        }
    }

    closeForm(): void {
        this.dialogRef.close();
    }

    startEditing(): void {
        this.editedRemark = this.evaluation?.remark || '';
        this.isEditing = true;
    }

    cancelEdit(): void {
        this.isEditing = false;
    }

    saveRemark(): void {
        if (this.evaluation) {
            this.evaluationService.updateRemarkOfEvaluationBySalesmanIdAndYear(
                this.evaluation.salesmanId,
                this.evaluation.year,
                this.editedRemark
            ).subscribe({
                next: (): void => {
                    this.evaluation.remark = this.editedRemark;
                    this.isEditing = false;
                },
                error: (error): void => console.error('Error updating remark:', error)
            });
        }
    }
}
