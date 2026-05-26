import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users';
  
  
  currentUser = signal<any>(null);

 
  getMyProfile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      tap(user => this.currentUser.set(user)) 
    );
  }

  
  updateProfile(userData: any, newPassword?: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    

    let params = new HttpParams();
    if (newPassword) {
      params = params.set('newPassword', newPassword);
    }

    return this.http.put<any>(`${this.apiUrl}/profile`, userData, { headers, params }).pipe(
      tap(updatedUser => this.currentUser.set(updatedUser)) 
    );
  }
}