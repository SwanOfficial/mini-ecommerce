import { computed, inject, Injectable, signal } from "@angular/core";
import { Product } from "../models/product.model";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.services";
import { OrderService } from "./order.services";

@Injectable({
  providedIn: "root",
})
export class CartService {
  cartItems = signal<Product[]>([]);
  private http = inject(HttpClient);
  private authService = inject(AuthService); 
  private orderService = inject(OrderService);

  totalItems = computed(() => this.cartItems().length);
  totalPrice = computed(() => this.cartItems().reduce((total, item) => total + item.price, 0));

  addToCart(product: Product) {
    this.cartItems.update(items => [...items, product]);
  }
   
  removeFromCart(productId: number) {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
  }

  
  checkoutWithSlip(shippingInfo: { shippingAddress: string, shippingPhone: string, paymentMethod: string }, slipFile: File) {
      
      
      const orderData = {
          customerEmail: this.authService.currentUserEmail(),
          shippingAddress: shippingInfo.shippingAddress,
          shippingPhone: shippingInfo.shippingPhone,
          paymentMethod: shippingInfo.paymentMethod,
          totalAmount: this.totalPrice(),
          items: this.cartItems().map(item => ({
              productId: item.id, 
              productName: item.name,
              imageUrl: item.imageUrl,
              price: item.price,
              quantity: 1 
          }))
      };

      
      return this.orderService.placeOrder(orderData, slipFile);
  }

  clearCart() {
    this.cartItems.set([]);
  }
}