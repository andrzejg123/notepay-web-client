import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { Token } from '../_models/token';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USERS: string = "/users"

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(environment.apiUrl + this.USERS + "/current");
  }

  registerUser(user: User): Observable<Token> {
    return this.http.post<Token>(environment.apiUrl + this.USERS, user);
  }

}
