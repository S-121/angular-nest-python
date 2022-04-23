import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GaService {
  constructor(private http: HttpClient) {}

  getGaUser() {
    const params = {
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
      .get(`${environment.gaUser}?${queryParams.join('&')}`, this.getHeaders())
      .toPromise();
  }

  getOrganicData(): Promise<any> {
    const params = {
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
        `${environment.organicData}?${queryParams.join('&')}`,
        this.getHeaders()
      )
      .toPromise();
  }

  getLandingPages(startRow = 0, rowLimit = 5, query = ''): Promise<any> {
    const params = {
      startRow,
      rowLimit,
      query,
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
        `${environment.landingPages}?${queryParams.join('&')}`,
        this.getHeaders()
      )
      .toPromise();
  }

  getPerformance(startRow = 0, rowLimit = 5, query = ''): Promise<any> {
    const params = {
      startRow,
      rowLimit,
      query,
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
        `${environment.performance}?${queryParams.join('&')}`,
        this.getHeaders()
      )
      .toPromise();
  }

  getPerformanceData(startRow = 0, rowLimit = 5, query = ''): Promise<any> {
    const params = {
      startRow,
      rowLimit,
      query,
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
        `${environment.performanceData}?${queryParams.join('&')}`,
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
