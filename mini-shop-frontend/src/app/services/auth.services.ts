import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:8080/api/auth';

  currentUserEmail = signal<string | null>(null);
  isLoggedIn = signal<boolean>(false);
  isAdmin = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole'); 

      if (token && email) {
        this.currentUserEmail.set(email);
        this.isLoggedIn.set(true);
        this.isAdmin.set(role === 'ADMIN');
      }
    }
  }

  signUp(username: string, email: string, password: string, phoneNumber: string, address: string) {
    
    const registerBody = { username, email, password, phoneNumber, address };
    return this.http.post<any>(`${this.apiUrl}/register`, registerBody).pipe(
      tap(res => this.handleAuth(res.token, email, res.role))
    );
  }

  login(email: string, password: string) {
    
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => this.handleAuth(res.token, email, res.role))
    );
  }
  
  private handleAuth(token: string, email: string, role: string) {
    this.currentUserEmail.set(email);
    this.isLoggedIn.set(true);
    this.isAdmin.set(role === 'ADMIN');

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', role); 
    }
  }

  logOut() {
    this.currentUserEmail.set(null);
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole'); 
    }
  }

  getToken() {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
  }
}