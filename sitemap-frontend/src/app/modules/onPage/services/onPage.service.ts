import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class OnPageService {
  constructor(private http: HttpClient) {}

  updateRows(rows) {
    console.log({ rows });

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
        `${environment.wqa}/update-rows?${queryParams.join('&')}`,
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
