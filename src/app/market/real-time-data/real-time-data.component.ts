import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { RealTimeDataService } from '../../service/real-time-data.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { buffer, skip, throttleTime } from 'rxjs';

@Component({
  selector: 'app-real-time-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './real-time-data.component.html',
  styleUrl: './real-time-data.component.scss',
  providers: [RealTimeDataService, CurrencyPipe],
})
export class RealTimeDataComponent implements OnInit, OnChanges {
  @Input() asset: string = 'BTC';
  public price: number | string = '-';
  public time: string = '-';
  public currentAsset: string = '-';

  constructor(
    private realTimeDataService: RealTimeDataService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.tradeStream();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currentAsset !== this.asset) {
      this.price = '-';
      this.time = '-';
      this.currentAsset = '-';
    }
    if (changes['asset']) {
      console.log(changes);
      this.subscribeToRealTimeData();
    }
  }

  subscribeToRealTimeData(): void {
    this.realTimeDataService.updateAsset(this.asset);
  }

  tradeStream() {
    const tradeStream = this.realTimeDataService.getTradeStream();

    tradeStream.pipe(buffer(tradeStream.pipe(throttleTime(5000)))).subscribe(
      (data) => {
        if (data.length > 0) {
          console.log(data);
          data.map((data) => console.log(data.price));
          const averagePrice =
            data.reduce((sum, trade) => sum + trade.price, 0) / data.length;
          this.currentAsset = this.asset + '/USDT';
          this.price = this.currencyPipe.transform(averagePrice, 'USD') || '-';
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
      },
      (error) => {
        this.currentAsset = '-';
        this.price = '-';
        this.time = '-';
        console.error(error);
      }
    );
  }
}
