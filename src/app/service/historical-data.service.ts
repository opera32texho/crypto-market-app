import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoricalDataService {
  private apiKey = 'D427FF40-65AA-4BE8-BD11-8250091A5F3A';
  private apiUrl = 'https://rest.coinapi.io/v1';

  constructor(private http: HttpClient) {}

  getHistoricalData(
    base: string,
    quote: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    const url = `${this.apiUrl}/exchangerate/${base}/${quote}/history?time_start=${startDate}&time_end=${endDate}&apikey=${this.apiKey}&period_id=10DAY&limit=100000`;
    return this.http.get(url);
  }
}
