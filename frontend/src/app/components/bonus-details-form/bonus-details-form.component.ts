import {Component, Inject, OnInit} from '@angular/core';
import {Evaluation} from '../../models/Evaluation';
import {EvaluationService} from '../../services/evaluation.service';
import {HttpResponse} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

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

    constructor(
        private evaluationService: EvaluationService,
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
}
