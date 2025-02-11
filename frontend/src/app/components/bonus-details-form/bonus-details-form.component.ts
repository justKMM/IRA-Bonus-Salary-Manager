import {Component, Input, OnInit} from '@angular/core';
import {Evaluation} from '../../models/Evaluation';
import {EvaluationService} from '../../services/evaluation.service';

@Component({
    selector: 'app-bonus-details-form',
    templateUrl: './bonus-details-form.component.html',
    styleUrls: ['./bonus-details-form.component.css']
})
export class BonusDetailsFormComponent implements OnInit {
    @Input() salesmanId!: number;
    @Input() year!: number;

    isVisible = true;
    evaluation: Evaluation | null = null;

    constructor(
        private evaluationService: EvaluationService,
    ) {}

    ngOnInit(): void {
        this.fetchEvaluation();
    }

    fetchEvaluation(): void {
        this.evaluationService.getEvaluationBySalesmanIdAndYear(this.salesmanId, this.year).subscribe(
            {
                next: (data): void => {
                    this.evaluation = data.body;
                },
                error: (error): void => {
                    console.error('Error fetching evaluation:', error);
                }
            }
        );
    }

    closeForm(): void {
        this.isVisible = false;
    }
}
