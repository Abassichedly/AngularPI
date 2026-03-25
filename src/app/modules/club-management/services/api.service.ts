import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  protected get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { 
      params: httpParams,
      headers: this.getHeaders()
    });
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, { 
      headers: this.getHeaders()
    });
  }

  protected put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, { 
      headers: this.getHeaders()
    });
  }

  protected patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data, { 
      headers: this.getHeaders()
    });
  }

  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { 
      headers: this.getHeaders()
    });
  }
}