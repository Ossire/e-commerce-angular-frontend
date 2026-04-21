import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error-service';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  env = environment;
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticated.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private errorService: ErrorService,
  ) {}

  logIn(payload: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/api/v1/auth/login`, payload).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('userEmail', payload.email);
        this.isAuthenticated.next(true);
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }

  signUp(payload: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/api/v1/auth/signup`, payload).pipe(
      tap((response) => {
        alert('User registration succesful, you can now login');
      }),
      catchError((error) => {
        return this.errorService.handleError(error);
      }),
    );
  }

  get loginStatus() {
    return this.isAuthenticated.value;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  get emailValue() {
    return localStorage.getItem('userEmail');
  }

  loggedOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userEmail');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
    console.log(this.isAuthenticated.value);
  }
}
