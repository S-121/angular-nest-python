import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(environment.users, this.getHeaders()).toPromise();
  }

  isEmailExists(email) {
    return this.http.get<{ exist: boolean }>(
      `${environment.users}/email/${email}`,
      this.getHeaders()
    );
  }

  getUserById(id) {
    return this.http
      .get(`${environment.users}/${id}`, this.getHeaders())
      .toPromise();
  }

  save(user) {
    return this.http
      .post(`${environment.users}/`, user, this.getHeaders())
      .toPromise();
  }

  updateUser(id, user) {
    return this.http
      .put(`${environment.users}/${id}`, user, this.getHeaders())
      .toPromise();
  }

  deleteUser(id) {
    return this.http
      .delete(`${environment.users}/${id}`, this.getHeaders())
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
