import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  constructor(private http: HttpClient) {}

  getRevenue(): any {
    const params = {
      viewId: localStorage.getItem('viewId'),
      projectId: localStorage.getItem('projectId'),
      startDate: localStorage.getItem('startDate'),
      endDate: localStorage.getItem('endDate'),
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop]) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .get(`${environment.revenue}?${queryParams.join('&')}`, this.getHeaders())
      .toPromise();
  }

  loadusergraph(keyword = 'all'): any {
    const params = {
      viewId: localStorage.getItem('viewId'),
      projectId: localStorage.getItem('projectId'),
      startDate: localStorage.getItem('startDate'),
      endDate: localStorage.getItem('endDate'),
      keyword,
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop]) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .get(`${environment.clicks}?${queryParams.join('&')}`, this.getHeaders())
      .toPromise();
  }

  getTopPerformance(startRow = 0, rowLimit = 5, query = ''): Promise<any> {
    const params = {
      startRow,
      rowLimit,
      query,
      startDate: localStorage.getItem('startDate'),
      endDate: localStorage.getItem('endDate'),
      viewId: localStorage.getItem('viewId'),
      projectId: localStorage.getItem('projectId'),
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop]) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .get(
        `${environment.dashboard}?${queryParams.join('&')}`,
        this.getHeaders()
      )
      .toPromise();
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
  }
}
