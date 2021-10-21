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

  private readonly TOKEN = 'token';
  private readonly USER = 'user';

  constructor(private http: HttpClient,
              private userService: UserService) {


    if (!this.isUserLoggedIn) { // make sure to delete data from previous login
      localStorage.removeItem(this.TOKEN);
      localStorage.removeItem(this.USER);
    }
    const token: Token = JSON.parse(localStorage.getItem(this.TOKEN));
    if(token == null)
      this.currentUserSubject = new BehaviorSubject(null);
    else {
      const user: User = JSON.parse(localStorage.getItem(this.USER));
      this.currentUserSubject = new BehaviorSubject(user);
    }

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get isUserLoggedIn() {

    const token: Token = JSON.parse(localStorage.getItem('token'));
    if (!token)
      return false;


    const now = new Date();
    const expirationDate: Date = new Date(token.expirationDate);

    return now.getTime() < expirationDate.getTime();
  }

  login(username: string, password: string) {
    return this.http.post<Token>(`${environment.apiUrl}/login`, { username, password })
      .pipe(map(token => {

        localStorage.setItem(this.TOKEN, JSON.stringify(token));
        this.userService.getCurrentUser().subscribe(user => {
          localStorage.setItem(this.USER, JSON.stringify(user));
          this.currentUserSubject.next(user);
        });

        return token;
      }));
  }

  logout() {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem(this.USER);
    this.currentUserSubject.next(null);
  }

  onUserUpdated(user: User) {
    this.currentUserSubject.next(user);
  }
}
