import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
interface RequestOptions {
  headers?: HttpHeaders;
  params?: HttpParams | { [param: string]: string | string[] };
}
@Injectable({
  providedIn: 'root',
})
export class HttpWrapperService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: RequestOptions): Observable<T> {
    const requestOptions = {
      ...options,
      observe: 'body' as 'body',
    };
    return this.http.get<T>(url, requestOptions).pipe(
      retry({
        count: 3,
        delay: this.getDelay(1),
      }),
      catchError((error) => {
        console.error('Error:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  private getDelay(retryAttempt: number): number {
    const delay = Math.min(1000 * 2 ** retryAttempt, 30000);
    const jitter = delay * 0.2 * Math.random();
    return delay + jitter;
  }
}
