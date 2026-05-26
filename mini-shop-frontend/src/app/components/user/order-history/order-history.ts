import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../../services/order.services';
import { AuthService } from '../../../services/auth.services';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTableModule, 
    MatChipsModule, 
    MatIconModule,MatSpinner
  ],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistory implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  
  myOrders = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadUserOrders();
  }

  loadUserOrders() {
    const email = this.authService.currentUserEmail();
    
    if (email) {
      this.orderService.getMyOrders(email).subscribe({
        next: (orders) => {
          this.myOrders.set(orders);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching orders:', err);
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
      console.warn('No user email found. Please log in.');
    }
  }

  // Status အလိုက် အရောင်ပြောင်းဖို့ Helper Function
  getColorStatus(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'status-pending';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-default';
    }
  }
}