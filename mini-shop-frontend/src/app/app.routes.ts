import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { Login } from './components/login/login';
import { Cart } from './components/cart/cart';
import { Admin } from './components/admin/admin';
import { adminGuard, authGuard } from './auth.guard';
import { OrderHistory } from './components/user/order-history/order-history';
import { UserProfile } from './components/user-profile/user-profile';

export const routes: Routes = [

       { path: '', component: ProductList },

  // 2. Login Page
  { path: 'login', component: Login },
  
  {path: 'profile', component: UserProfile, canActivate: [authGuard]},
   { path: 'admin', component: Admin,canActivate: [adminGuard] }, 

  { 
    path: 'my-orders', 
    component: OrderHistory,
    canActivate: [authGuard]
  },
 
  { path: '**', redirectTo: '', pathMatch: 'full' }

  


];
