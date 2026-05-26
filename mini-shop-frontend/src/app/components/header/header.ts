import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { ProductService } from '../../services/product.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';


@Component({
  selector: 'app-header',
  imports: [CommonModule,
     MatToolbarModule,
     MatButtonModule,
     MatIconModule,
     MatBadgeModule,
    MatMenuModule,
    MatDivider],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
      
  cartService = inject(CartService);
  authService = inject(AuthService);
  productService = inject(ProductService);
  private router = inject(Router);
  goToLogin() {
    this.router.navigate(['/login']); // Login page ကို သွားမယ်
  }

  goToHome() {
    this.router.navigate(['/']); // Home (Product List) ကို ပြန်သွားမယ်
  }

  goToProfile() {
  this.router.navigate(['/profile']);
}

  onLogout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
  goToAdmin() {
    this.router.navigate(['/admin']); 
  }

  goToMyOrders() {
  this.router.navigate(['/my-orders']);
}
  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    // ProductService ထဲက searchQuery signal ကို update လုပ်မယ်
    this.productService.searchProduct.set(value);
    
    // တကယ်လို့ User က တခြား page ရောက်နေရင် Home ကို ပြန်ပို့ပေးဖို့ လိုနိုင်ပါတယ်
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }
}
