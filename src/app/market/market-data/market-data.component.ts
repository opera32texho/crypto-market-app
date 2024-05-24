import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { RealTimeDataService } from '../../service/real-time-data.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { throttleTime } from 'rxjs';

@Component({
  selector: 'app-market-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-data.component.html',
  styleUrl: './market-data.component.scss',
  providers: [RealTimeDataService, CurrencyPipe],
})
export class MarketDataComponent implements OnInit, OnChanges {
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
      this.subscribeToRealTimeData();
    }
  }

  private subscribeToRealTimeData(): void {
    this.realTimeDataService.updateAsset(this.asset);
  }

  private tradeStream() {
    const tradeStream = this.realTimeDataService.getTradeStream();
    tradeStream.pipe(throttleTime(5000)).subscribe((data) => {
      this.currentAsset = this.asset + '/USD';
      this.price = this.currencyPipe.transform(data.price, 'USD') || '-';
      this.time = new Date(data.time_exchange).toLocaleTimeString('en-Us', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    });
  }
}
