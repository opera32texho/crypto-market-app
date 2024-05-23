import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  SubscribeOutRequest,
  TradeData,
} from '../interface/real-time-daata.interface';

@Injectable({
  providedIn: 'root',
})
export class RealTimeDataService {
  private apiKey: string = 'D427FF40-65AA-4BE8-BD11-8250091A5F3A';
  private ws: WebSocketSubject<SubscribeOutRequest | TradeData> = webSocket({
    url: `wss://ws.coinapi.io/v1/`,
  });

  private currentAsset: string | null = null;

  constructor() {
    this.ws.subscribe();
  }

  public updateAsset(asset: string) {
    if (this.currentAsset === asset) {
      return;
    }

    if (this.currentAsset !== null) {
      this.ws.next({
        type: 'unsubscribe',
        apikey: this.apiKey,
        heartbeat: false,
        subscribe_data_type: ['trade'],
        subscribe_filter_asset_id: [`${this.currentAsset}/USDT`],
        subscribe_filter_exchange_id: ['BINANCE'],
      });
    }

    this.currentAsset = asset;
    this.ws.next({
      type: 'subscribe',
      apikey: this.apiKey,
      heartbeat: false,
      subscribe_data_type: ['trade'],
      subscribe_filter_asset_id: [`${asset}/USDT`],
      subscribe_filter_exchange_id: ['BINANCE'],
    });
  }

  public getTradeStream(): Observable<TradeData> {
    return this.ws.pipe(map((message) => message as TradeData));
  }
}
