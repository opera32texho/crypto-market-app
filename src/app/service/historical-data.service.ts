import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { API_CONFIG } from '../constants/http.constants';

@Injectable({
  providedIn: 'root',
})
export class HistoricalDataService {
  constructor(private http: HttpWrapperService) {}

  getHistoricalData(
    base: string,
    period_id: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    const url = `${API_CONFIG.apiUrl}/exchangerate/${base}/usdt/history?time_start=${startDate}&time_end=${endDate}&apikey=${API_CONFIG.apiKey}&period_id=${period_id}&limit=100000`;
    return this.http.get(url);
  }
}
