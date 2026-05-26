import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ProductService } from '../../services/product.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { CheckoutDialog } from '../checkout-dialog/checkout-dialog'; 

@Component({
  selector: 'app-cart',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule,MatDialogModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart {
  cartService = inject(CartService);
  authService = inject(AuthService);
  productService = inject(ProductService);
  private dialog = inject(MatDialog);
  router = inject(Router);
  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

 checkout() {
    if (this.cartService.cartItems().length === 0){
      alert('Your cart is empty!');
      return;
    }

    if(!this.authService.isLoggedIn()){
      alert('Please log in to checkout.');
      this.router.navigate(['/login']);
      return;
    }

    // open dialog before order placement
    const dialogRef = this.dialog.open(CheckoutDialog, {
      width: '450px',
      disableClose: true 
    });

    // Dialog ပိတ်သွားတဲ့အခါ (User က Confirm & Place Order နှိပ်လိုက်တဲ့အခါ)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { formValue, slipFile } = result;

       
        this.cartService.checkoutWithSlip(formValue, slipFile).subscribe({
          next: () => {
            alert('Order Placed Successfully! Awaiting Admin Confirmation.');
            this.cartService.clearCart(); 
            this.productService.fetchProducts();
          },
          error: (err) => {
            console.error('Order failed', err);
            alert(err.error || 'Something went wrong while placing order!');
          }
        });
      }
    });
  }

}
