import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';

@Injectable()
export class CategoryService {
  public url: string;
  public token: any;
  public identity: any;

  constructor(private _http: HttpClient) {
    this.url = global.url;
  }

  create(token: any, category: any): Observable<any> {
    let json = JSON.stringify(category);
    let params = `json=${json}`;
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);
    return this._http.post(`${this.url}/category`, params, { headers });
  }

  getCategories(): Observable<any> {
    return this._http.get(`${this.url}/category`);
  }

  getCategory(id: any): Observable<any> {
    return this._http.get(`${this.url}/category/${id}`);
  }

  getPostsFromCategory(id: any): Observable<any> {
    return this._http.get(`${this.url}/post/category/${id}`);
  }
}
