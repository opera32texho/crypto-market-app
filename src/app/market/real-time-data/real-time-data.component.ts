import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { RealTimeDataService } from '../../service/real-time-data.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { buffer, throttleTime } from 'rxjs';

@Component({
  selector: 'app-real-time-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './real-time-data.component.html',
  styleUrl: './real-time-data.component.scss',
  providers: [RealTimeDataService, CurrencyPipe],
})
export class RealTimeDataComponent implements OnInit, OnChanges {
  @Input() symbol: string = 'BTC';
  public price!: number;
  public time!: string;

  constructor(private realTimeDataService: RealTimeDataService) {}

  ngOnInit() {
    const tradeStream = this.realTimeDataService.getTradeStream();

    tradeStream
      .pipe(buffer(tradeStream.pipe(throttleTime(5000))))
      .subscribe((data) => {
        if (data.length > 0) {
          const averagePrice =
            data.reduce((sum, trade) => sum + trade.price, 0) / data.length;
          this.price = averagePrice;
          this.time = new Date(
            data[data.length - 1].time_exchange
          ).toLocaleTimeString('en-Us', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['symbol']) {
      this.subscribeToRealTimeData();
    }
  }

  subscribeToRealTimeData(): void {
    this.realTimeDataService.updateAsset(this.symbol);
  }
}
