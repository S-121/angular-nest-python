import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private http: HttpClient) {}

  getProjects() {
    return this.http.get(environment.projects, this.getHeaders()).toPromise();
  }

  getProjectById(id) {
    const params = {
      projectId: id,
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop] !== undefined) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .get(
        `${environment.projects}/${id}?${queryParams.join('&')}`,
        this.getHeaders()
      )
      .toPromise();
  }

  gaViewOfProperty(id, accountId) {
    return this.http
      .get(
        `${environment.projects}/gaViewOfProperty?accountId=${accountId}&webPropertyId=${id}`,
        this.getHeaders()
      )
      .toPromise();
  }

  gaProperties() {
    return this.http
      .get(`${environment.projects}/gaProperties`, this.getHeaders())
      .toPromise();
  }

  accurDomain() {
    return this.http
      .get(`${environment.projects}/accurDomain`, this.getHeaders())
      .toPromise();
  }

  gscSites() {
    return this.http
      .get(`${environment.projects}/gscSites`, this.getHeaders())
      .toPromise();
  }

  save(project) {
    return this.http
      .post(`${environment.projects}/`, project, this.getHeaders())
      .toPromise();
  }

  updateProject(id, project) {
    return this.http
      .put(`${environment.projects}/${id}`, project, this.getHeaders())
      .toPromise();
  }

  deleteProject(id) {
    return this.http
      .delete(`${environment.projects}/${id}`, this.getHeaders())
      .toPromise();
  }

  searchUser(projectId, query, users): any {
    const params = {
      projectId,
      query,
      users,
    };
    const queryParams = [];
    for (let prop in params) {
      if (params[prop] !== undefined) {
        queryParams.push(`${prop}=${params[prop]}`);
      }
    }
    return this.http
      .get(
        `${environment.projects}/search-user?${queryParams.join('&')}`,
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
