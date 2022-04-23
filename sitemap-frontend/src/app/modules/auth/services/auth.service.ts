import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login({ email, password }) {
    return this.http
      .post<{ access_token: string }>(`${environment.auth}/login`, {
        email,
        password,
      })
      .toPromise();
  }

  register(user) {
    return this.http
      .post<{ access_token: string }>(`${environment.auth}/register`, user)
      .toPromise();
  }

  getGoogleLoginUrl(method) {
    return this.http
      .get<{ url: string }>(`${environment.auth}/googleLink?&method=${method}`)
      .toPromise();
  }

  getResetPasswordLink(email) {
    return this.http
      .post<{ access_token: string }>(`${environment.resetPasswordLink}`, {
        email,
      })
      .toPromise();
  }
  doResetPassword({ password, id }) {
    return this.http
      .post<{ access_token: string }>(`${environment.doResetPassword}`, {
        password,
        id,
      })
      .toPromise();
  }
  getGoogleUserInfo(code, method) {
    return this.http
      .get<{ user: any }>(
        `${environment.auth}/googleUserInfo/?code=${code}&method=${method}`
      )
      .toPromise();
  }
}
