import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TokenPayload {
  email: string;
  password: string;
}
export interface UserDetails {
  email: string;
  campaignName: string;
  userName: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private setEmail(email: string): void {
    localStorage.setItem('email', email);
  }
  private setToken(token: string): void {
    localStorage.setItem('token', token);
    this.token = token;
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public login(user: TokenPayload): Observable<any> {
    const res = this.http.post('users/login', user);
    localStorage.setItem('user', user.email);
    const request = res.pipe(
      map((data: any) => {
        if (data.token) {
          this.setToken(data.token);
        }
        return data;
      }),
    );
    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    const res = this.http.post('users/register', user);
    this.setEmail(user.email);
    localStorage.setItem('userName', 'Default User');
    return res;
  }
}
