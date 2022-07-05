import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';

@Injectable()
export class PostService {
  public url: string;
  public token: any;
  public identity: any;

  constructor(private _http: HttpClient) {
    this.url = global.url;
  }

  create(token: any, post: any): Observable<any> {
    let json = JSON.stringify(post);
    let params = `json=${json}`;
    let headers = new HttpHeaders()
      .set('Authorization', token)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(`${this.url}/post`, params, { headers });
  }

  uploadImage(token: any, image: any): Observable<any> {
    let params = image;
    let headers = new HttpHeaders().set('Authorization', token);
    return this._http.post(`${this.url}/post/upload`, params, { headers });
  }

  getPosts(): Observable<any> {
    return this._http.get(`${this.url}/post`);
  }

  getPost(id: any): Observable<any> {
    return this._http.get(`${this.url}/post/${id}`);
  }

  update(token: any, post: any, id: any): Observable<any> {
    let json = JSON.stringify(post);
    let params = `json=${json}`;
    let headers = new HttpHeaders()
      .set('Authorization', token)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.put(`${this.url}/post/${id}`, params, { headers });
  }

  delete(token: any, id: any): Observable<any> {
    let headers = new HttpHeaders().set('Authorization', token);
    return this._http.delete(`${this.url}/post/${id}`, { headers });
  }
}
