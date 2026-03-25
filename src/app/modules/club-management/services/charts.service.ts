import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartData } from '../models/chart-data';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ChartsService extends ApiService {
  
  getDashboardCharts(clubId: number): Observable<{ [key: string]: ChartData }> {
    return this.get<{ [key: string]: ChartData }>(`/charts/dashboard/${clubId}`);
  }
}