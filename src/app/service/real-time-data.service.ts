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
      this.ws.next(this.createCoinApiRequest('unsubscribe', this.currentAsset));
    }

    this.currentAsset = asset;
    this.ws.next(this.createCoinApiRequest('subscribe', asset));
  }

  public getTradeStream(): Observable<ITradeData> {
    return this.ws.pipe(map((message) => message as ITradeData));
  }

  private createCoinApiRequest(type: string, asset: string) {
    return {
      type: type,
      apikey: API_CONFIG.apiKey,
      heartbeat: false,
      subscribe_data_type: ['trade'],
      subscribe_filter_asset_id: [`${asset}/USD`],
      subscribe_filter_exchange_id: ['COINBASE'],
    };
  }
}
