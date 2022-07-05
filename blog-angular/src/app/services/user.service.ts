import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';

@Injectable()
export class UserService {
  public url: string;
  public token: any;
  public identity: any;

  constructor(public _http: HttpClient) {
    this.url = global.url;
  }

  register(user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = `json=${json}`;
    let headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    return this._http.post(`${this.url}/register`, params, { headers });
  }

  signup(user: any, getToken: any = null): Observable<any> {
    if (getToken != null) {
      user.getToken = 'true';
    }
    let json = JSON.stringify(user);
    let params = `json=${json}`;
    let headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    return this._http.post(`${this.url}/login`, params, { headers });
  }

  getIdentity() {
    let identity = JSON.parse(localStorage.getItem('identity') || '{}');
    if (identity && identity != 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken() {
    let token = localStorage.getItem('token');
    if (token && token != 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  update(token: any, user: any): Observable<any> {
    let json = JSON.stringify(user);
    let params = `json=${json}`;
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);
    return this._http.put(`${this.url}/user/update`, params, { headers });
  }

  uploadImage(token: any, image: any): Observable<any> {
    let params = image;
    let headers = new HttpHeaders().set('Authorization', token);
    return this._http.post(`${this.url}/user/upload`, params, { headers });
  }

  getPostsFromUser(id: any): Observable<any> {
    return this._http.get(`${this.url}/post/user/${id}`);
  }

  getDetails(id: any): Observable<any> {
    return this._http.get(`${this.url}/user/detail/${id}`);
  }
}
