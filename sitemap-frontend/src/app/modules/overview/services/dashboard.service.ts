import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  filters = { filterBar1: [], filterBar2: [] };
  public keywordChanged: EventEmitter<string> = new EventEmitter<string>();

  query: string;
  queryChanged: EventEmitter<boolean> = new EventEmitter();
  debouncer: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.debouncer
      .pipe(debounceTime(1000))
      .pipe(throttleTime(1000))
      .subscribe((value) => this.queryChanged.emit(value));
  }

  getRevenue(): any {
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
        `${environment._dashboard}/revenue?${queryParams.join('&')}&${
          this.query
        }`,
        this.getHeaders()
      )
      .toPromise();
  }

  getKeywordChart(): any {
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
        `${environment._dashboard}/keyword-chart?${queryParams.join('&')}&${
          this.query
        }`,
        this.getHeaders()
      )
      .toPromise();
  }

  getTopPerformance(offset, pageSize, q): any {
    const params = {
      viewId: localStorage.getItem('viewId'),
      projectId: localStorage.getItem('projectId'),
      offset,
      pageSize,
      q,
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop]) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .get(
        `${environment._dashboard}/top-performing?${queryParams.join('&')}&${
          this.query
        }`,
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
