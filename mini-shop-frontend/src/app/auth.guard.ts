import { inject } from "@angular/core";
import { AuthService } from "./services/auth.services";
import { Router } from "@angular/router";


export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    alert('Please login to continue!');
    router.navigate(['/login']);
    return false;
  }
};


export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  } else {
    alert('Access Denied: You are not an Admin!');
    router.navigate(['/']);
    return false;
  }
};