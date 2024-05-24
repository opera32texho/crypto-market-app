import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HistoricalDataService } from '../../service/historical-data.service';
import { BaseChartDirective } from 'ng2-charts';
import { IHistoricalDataChart } from '../../interface/historical-chart.interface';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-historical-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss',
  providers: [HistoricalDataService],
})
export class HistoricalChartComponent implements OnChanges {
  @Input() asset: string = 'BTC';

  public historicalData: IHistoricalDataChart[] = [];
  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };
  public chartOptions: ChartOptions<'line'> = this.createDefaultOptions();

  private currentInterval: string = '1M';
  constructor(private historicalDataService: HistoricalDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['asset']) {
      this.fetchHistoricalData();
    }
  }
  fetchHistoricalData(): void {
    let period_id = '12HRS';
    let startDate;
    const endDate = new Date().toISOString();

    switch (this.currentInterval) {
      case '1D':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        period_id = '30MIN';
        break;
      case '1W':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        period_id = '3HRS';
        break;
      case '1M':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '6M':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        period_id = '5DAY';
        break;
      case '1Y':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        period_id = '10DAY';
        break;
      case '3Y':
        startDate = new Date('2021-01-01T00:00:00Z');
        period_id = '10DAY';
        break;
      default:
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
    }

    startDate = startDate.toISOString();

    this.historicalDataService
      .getHistoricalData(this.asset, period_id, startDate, endDate)
      .subscribe((data) => {
        this.historicalData = data;
        this.updateChartData();
      });
  }

  updateChartData(): void {
    this.chartData = {
      labels: this.historicalData.map((data) =>
        new Date(data.time_period_start).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit',
        })
      ),
      datasets: [
        {
          label: 'Price',
          data: this.historicalData.map(
            (data) => (data.rate_high + data.rate_low) / 2
          ),
          borderColor: 'rgba(192, 75, 192, 1)',
          borderWidth: 1,
          fill: false,
        },
      ],
    };
  }
  setInterval(interval: string): void {
    this.currentInterval = interval;
    this.fetchHistoricalData();
  }

  private createDefaultOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          grid: {
            display: false,
          },

          ticks: {
            autoSkip: true,
            maxTicksLimit: 12,
          },
        },
        y: {
          grid: {
            display: false,
          },

          ticks: {
            callback: function (value) {
              return '$' + value;
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += '$' + context.parsed.y;
              return label;
            },
          },
        },
      },
    };
  }
}
