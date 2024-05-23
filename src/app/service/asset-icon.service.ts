import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssetIcon } from '../interface/asset-icon.interface';

@Injectable({
  providedIn: 'root',
})
export class AssetIconService {
  private apiKey = 'D427FF40-65AA-4BE8-BD11-8250091A5F3A';
  private apiUrl = 'https://rest.coinapi.io/v1/assets/icons/25';

  constructor(private http: HttpClient) {}

  getAssetIcons(): Observable<AssetIcon[]> {
    const headers = { 'X-CoinAPI-Key': this.apiKey };
    return this.http.get<AssetIcon[]>(this.apiUrl, { headers });
  }
}
