import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Token } from '../_models/token';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient,
              private userService: UserService) {


    if (!this.isUserLoggedIn)  // make sure to delete data from previous login
      localStorage.removeItem('token');
    const token: Token = JSON.parse(localStorage.getItem('token'));
    if(token != null)
      this.currentUserSubject = new BehaviorSubject(token.user);
    else
      this.currentUserSubject = new BehaviorSubject(null);

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get isUserLoggedIn() {

    const token: Token = JSON.parse(localStorage.getItem('token'));
    if (!token)
      return false;


    const date = new Date();
    const expirationDate: Date = new Date(token.expirationDate);

    return date.getTime() < expirationDate.getTime();
  }

  login(email: string, password: string) {
    return this.http.post<Token>(`${environment.apiUrl}/login`, { email, password })
      .pipe(map(token => {

        localStorage.setItem('token', JSON.stringify(token));
        this.currentUserSubject.next(token.user);
        return token;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  onUserUpdated(user: User) {
    this.currentUserSubject.next(user);
  }
}
