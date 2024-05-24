import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  ISubscribeOutRequest,
  ITradeData,
} from '../interface/real-time-daata.interface';
import { API_CONFIG } from '../constants/http.constants';

@Injectable({
  providedIn: 'root',
})
export class RealTimeDataService {
  private ws: WebSocketSubject<ISubscribeOutRequest | ITradeData> = webSocket({
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
        apikey: API_CONFIG.apiKey,
        heartbeat: false,
        subscribe_data_type: ['trade'],
        subscribe_filter_asset_id: [`${this.currentAsset}/USDT`],
        subscribe_filter_exchange_id: ['BINANCEFTS'],
      });
    }

    this.currentAsset = asset;
    this.ws.next({
      type: 'subscribe',
      apikey: API_CONFIG.apiKey,
      heartbeat: false,
      subscribe_data_type: ['trade'],
      subscribe_filter_asset_id: [`${asset}/USDT`],
      subscribe_filter_exchange_id: ['BINANCEFTS'],
    });
  }

  public getTradeStream(): Observable<ITradeData> {
    return this.ws.pipe(map((message) => message as ITradeData));
  }
}
