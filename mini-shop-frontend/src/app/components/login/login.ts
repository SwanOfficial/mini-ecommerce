import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  
  authService = inject(AuthService);
  router = inject(Router);

  onLogin(email: string, password: string) {
    if (!email || !password) return alert('Please fill email and password');
    
    this.authService.login(email, password).subscribe({
      next: () => {
        alert('Login Successful!');
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error(err);
        alert('Login Failed: Invalid email or password');
      }
    });
  }

  onSignUp(username: string, email: string, pass: string, phone: string, address: string) {
    if (!username || !email || !pass) return alert('Username, Email and Password are required!');

    this.authService.signUp(username, email, pass, phone, address).subscribe({
      next: () => {
        alert('Sign Up Successful!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        alert('Sign Up Error: Registration failed or User already exists');
      }
    });
  }
}