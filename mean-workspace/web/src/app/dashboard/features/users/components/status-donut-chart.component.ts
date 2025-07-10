import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

export interface ChartDataInput {
  title: string;
  data: number[];
  labels: string[];
  total: number;
  centerText?: string;
}

@Component({
  selector: 'app-status-donut-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ChartModule,
    CardModule
  ],
  templateUrl: './status-donut-chart.component.html',
  styleUrls: ['./status-donut-chart.component.scss']
})
export class StatusDonutChartComponent implements OnInit, OnChanges {
  @Input() chartData!: ChartDataInput;
  @Input() title = 'Status Distribution';
  @Input() showToggle = false;
  @Input() toggleButtonText = 'Toggle View';
  
  @Output() segmentClick = new EventEmitter<{label: string, value: number, index: number}>();
  @Output() legendClick = new EventEmitter<{label: string, value: number, index: number}>();
  @Output() toggleClick = new EventEmitter<void>();

  public doughnutChartType = 'doughnut' as const;
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };
  
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  };

  ngOnInit() {
    this.setupChartData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartData']) {
      this.setupChartData();
    }
  }

  private setupChartData() {
    if (this.chartData) {
      this.doughnutChartData = {
        labels: this.chartData.labels,
        datasets: [
          {
            data: this.chartData.data,
            backgroundColor: [
              '#4CAF50',  // Green for Active
              '#FF9800',  // Orange for Pending
              '#F44336',  // Red for Inactive
              '#2196F3',  // Blue for other statuses
              '#9C27B0'   // Purple for additional statuses
            ],
            hoverBackgroundColor: [
              '#45a049',
              '#e68900',
              '#da190b',
              '#0b7dda',
              '#7b1fa2'
            ]
          }
        ]
      };
    }
  }

  get totalCount(): number {
    return this.chartData?.total || 0;
  }

  get centerText(): string {
    return this.chartData?.centerText || this.totalCount.toString();
  }

  getLegendColor(index: number): string {
    const colors = [
      '#4CAF50',  // Green for Active
      '#FF9800',  // Orange for Pending
      '#F44336',  // Red for Inactive
      '#2196F3',  // Blue for other statuses
      '#9C27B0'   // Purple for additional statuses
    ];
    return colors[index] || '#757575';
  }

  getPercentage(index: number): string {
    if (!this.chartData || !this.chartData.data || !this.chartData.data[index] || this.totalCount === 0) return '0';
    const percentage = (this.chartData.data[index] / this.totalCount) * 100;
    return percentage.toFixed(1);
  }

  onLegendClick(index: number) {
    if (this.chartData && this.chartData.labels && this.chartData.data) {
      this.legendClick.emit({
        label: this.chartData.labels[index],
        value: this.chartData.data[index],
        index
      });
    }
  }
  
  onToggleClick() {
    this.toggleClick.emit();
  }
}