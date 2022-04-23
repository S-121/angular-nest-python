import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class ContentWorkbookService {
  public dirty: boolean;
  public saveItems: EventEmitter<boolean> = new EventEmitter();
  subject: Subject<boolean> = new Subject();

  constructor(private http: HttpClient) {}

  getSettings(): Promise<any[]> {
    const params = {
      projectId: localStorage.getItem('projectId'),
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop] !== undefined) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .get<any[]>(
        `${environment.cwb}/settings?${queryParams.join('&')}`,
        this.getHeaders()
      )
      .toPromise();
  }

  updateSettings(body) {
    const params = {
      projectId: localStorage.getItem('projectId'),
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop] !== undefined) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .put(
        `${environment.cwb}/update-settings?${queryParams.join('&')}`,
        { ...body },
        this.getHeaders()
      )
      .toPromise();
  }

  getDisapproved(
    index = 0,
    offset = 0,
    pageSize = 5,
    query = ''
  ): Promise<any> {
    const params = {
      viewId: localStorage.getItem('viewId'),
      projectId: localStorage.getItem('projectId'),
      index,
      offset,
      pageSize,
      query,
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop] !== undefined) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .get(
        `${environment.cwb}/disapproved?${queryParams.join('&')}`,
        this.getHeaders()
      )
      .toPromise();
  }
  getPublished(index = 0, offset = 0, pageSize = 5, query = ''): Promise<any> {
    const params = {
      viewId: localStorage.getItem('viewId'),
      projectId: localStorage.getItem('projectId'),
      index,
      offset,
      pageSize,
      query,
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop] !== undefined) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .get(
        `${environment.cwb}/published?${queryParams.join('&')}`,
        this.getHeaders()
      )
      .toPromise();
  }

  getQueue(query = ''): Promise<any> {
    const params = {
      projectId: localStorage.getItem('projectId'),
      query,
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop] !== undefined) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .get(`${environment.cwb}?${queryParams.join('&')}`, this.getHeaders())
      .toPromise();
  }

  updateRows(rows) {
    const params = {
      projectId: localStorage.getItem('projectId'),
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop] !== undefined) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .put(
        `${environment.cwb}/update-rows?${queryParams.join('&')}`,
        { rows },
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
