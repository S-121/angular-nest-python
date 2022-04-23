import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MasterWqaService {
  constructor(private http: HttpClient) {}

  getMasterWqa(offset = 0, pageSize = 5, query = ''): Promise<any> {
    const params = {
      viewId: localStorage.getItem('viewId'),
      projectId: localStorage.getItem('projectId'),
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
      .get(`${environment.wqa}?${queryParams.join('&')}`, this.getHeaders())
      .toPromise();
  }

  uploadCSV(project) {
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
        `${environment.wqa}?${queryParams.join('&')}`,
        project,
        this.getHeaders()
      )
      .toPromise();
  }

  uploadAhrefsCSV(project) {
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
        `${environment.wqa}/ahrefs?${queryParams.join('&')}`,
        project,
        this.getHeaders()
      )
      .toPromise();
  }

  updateRow(row) {
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
        `${environment.wqa}/update-row?${queryParams.join('&')}`,
        row,
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
