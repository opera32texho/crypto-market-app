import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetIcon } from '../interface/asset-icon.interface';
import { HttpWrapperService } from './http-wrapper.service';
import { HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../constants/http.constants';

@Injectable({
  providedIn: 'root',
})
export class AssetIconService {
  constructor(private http: HttpWrapperService) {}

  getAssetIcons(): Observable<AssetIcon[]> {
    const headers = new HttpHeaders().set('X-CoinAPI-Key', API_CONFIG.apiKey);
    return this.http.get<AssetIcon[]>(`${API_CONFIG.apiUrl}/assets/icons/25`, {
      headers,
    });
  }
}
