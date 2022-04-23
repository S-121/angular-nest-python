import axios from "axios";

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KeywordService {

  constructor(
    private http: HttpClient,
  ) {}

  getTargetkeyword(
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
        `${environment.keywordResearch}/target?${queryParams.join('&')}`,
        this.getHeaders()
      )
      .toPromise();
  }

  getkeyword(index = 0, offset = 0, pageSize = 5, query = ''): Promise<any> {
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
        `${environment.keywordResearch}?${queryParams.join('&')}`,
        this.getHeaders()
      )
      .toPromise();
  }

  getKeywordRanking(startRow = 0, rowLimit = 5, query = ''): Promise<any> {
    const params = {
      startRow,
      rowLimit,
      query,
      startDate: localStorage.getItem('startDate'),
      endDate: localStorage.getItem('endDate'),
      viewId: localStorage.getItem('viewId'),
      projectId: localStorage.getItem('projectId'),
      accuDomain: JSON.parse(localStorage.getItem('project')).accuDomain,
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop]) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .get(`${environment.keyword}?${queryParams.join('&')}`, this.getHeaders())
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
        `${environment.keywordResearch}/update-row?${queryParams.join('&')}`,
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

  async fileupload(res) {
    console.log(res)
    let formData = new FormData();
    
    return axios({
      method:'post',
      // url: `${environment.keyWordSearchURL}/uploader`,
      url: "http://localhost:2000/python/uploader",
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  dataSave (data) {
    console.log(data)
    return this.http
      .post(`${environment.keywordResearch}/csv-save`, data)
      .toPromise();
  }

  getCSV(): Promise<any> {
    return this.http
      .get(`${environment.keywordResearch}/get-csv`)
      .toPromise();
  }

  find_keywords(data) {
    const keywords = data
    console.log(keywords)
    return axios({
      method:'post',
      // url: `${environment.keyWordSearchURL}/keywords_clustered`,
      url: "http://localhost:2000/python/keywords_clustered",
      data: keywords,
    })
  }
}
