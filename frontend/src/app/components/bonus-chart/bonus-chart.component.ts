import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BonusSalary} from '../../models/BonusSalary';
import {ChartConfiguration, ChartOptions} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';

@Component({
    selector: 'app-bonus-chart',
    templateUrl: './bonus-chart.component.html',
    styleUrls: ['./bonus-chart.component.css']
})
export class BonusChartComponent implements OnInit {
    @Input() bonusData: Map<number, BonusSalary[]> = new Map();
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    lineChartData: ChartConfiguration<'line'>['data'] = {
        datasets: [],
        labels: []
    };

    lineChartOptions: ChartOptions<'line'> = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Bonus Amount'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Year'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            title: {
                display: true,
                text: 'Bonus Salary History'
            }
        }
    };

    // Array of colors for different lines
    colors: string[] = [
        'rgb(75, 192, 192)',   // teal
        'rgb(255, 99, 132)',   // pink
        'rgb(54, 162, 235)',   // blue
        'rgb(255, 206, 86)',   // yellow
        'rgb(153, 102, 255)',  // purple
        'rgb(255, 159, 64)'    // orange
    ];

    ngOnInit(): void {
        this.updateChart();
    }

    updateChart(): void {
        // Get all unique years across all salesmen
        const allYears = new Set<number>();
        this.bonusData.forEach((bonuses): void => {
            bonuses.forEach((bonus): Set<number> => allYears.add(bonus.year));
        });
        const sortedYears = Array.from(allYears).sort((a, b): number => a - b);

        // Create datasets for each salesman
        const datasets = Array
            .from(this.bonusData.entries())
            .map((
                [salesmanId, bonuses],
                index):
            {
                data: number[];
                label: string;
                borderColor: string;
                tension: number;
                fill: boolean;
            } => ({
                data: sortedYears.map((year): number => {
                    const bonusForYear = bonuses.find((bonus): boolean => bonus.year === year);
                    return bonusForYear ? bonusForYear.value : null;
                }),
                label: `${salesmanId}`,
                borderColor: this.colors[index % this.colors.length],
                tension: 0.1,
                fill: false
            }));

        this.lineChartData = {
            datasets,
            labels: sortedYears.map((year): string => year.toString())
        };
    }
}
