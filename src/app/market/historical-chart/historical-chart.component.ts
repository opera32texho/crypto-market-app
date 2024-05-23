import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { HistoricalDataService } from '../../service/historical-data.service';
import { BaseChartDirective } from 'ng2-charts';

import { HttpClientModule } from '@angular/common/http';
import { IHistoricalDataChart } from '../../interface/historical-chart.interface';
import { ChartData, ChartOptions } from 'chart.js';
@Component({
  selector: 'app-historical-chart',
  standalone: true,
  imports: [BaseChartDirective, HttpClientModule],
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss',
  providers: [HistoricalDataService],
})
export class HistoricalChartComponent implements OnInit, OnChanges {
  @Input() symbol: string = 'BTC';

  public historicalData: IHistoricalDataChart[] = [];
  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };
  public chartOptions: ChartOptions<'line'> = this.createDefaultOptions();

  constructor(private historicalDataService: HistoricalDataService) {}

  ngOnInit(): void {
    this.fetchHistoricalData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['symbol']) {
      this.fetchHistoricalData();
    }
  }
  fetchHistoricalData(): void {
    const startDate = '2021-01-01T00:00:00';
    const endDate = new Date().toISOString().slice(0, -1);

    this.historicalDataService
      .getHistoricalData(this.symbol, 'USD', startDate, endDate)
      .subscribe((data) => {
        this.historicalData = data;
        this.updateChartData();
      });
  }

  updateChartData(): void {
    this.chartData = {
      labels: this.historicalData.map((data) =>
        new Date(data.time_period_start).toLocaleDateString()
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

  private createDefaultOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: 'Price',
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
