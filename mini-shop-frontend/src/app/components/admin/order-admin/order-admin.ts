import { Component, inject, OnInit,Inject } from '@angular/core';
import { OrderService } from '../../../services/order.services';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormField } from "@angular/material/form-field";
import { MatSelectModule, MatSelect, MatOption } from "@angular/material/select";
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'; 

@Component({
  selector: 'app-order-admin',
  
  imports: [CommonModule, MatCardModule, MatTableModule, MatFormField, MatSelect, MatOption, FormsModule, MatIcon, MatDialogModule],
  templateUrl: './order-admin.html',
  styleUrls: ['./order-admin.css'],
})
export class OrderAdmin implements OnInit{

  orderService = inject(OrderService);
  private dialog = inject(MatDialog); 

  ngOnInit() {
    this.orderService.fetchOrders(); 
  }

  onStatusChange(orderId: number, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        alert('Order status updated!');
        this.orderService.fetchOrders();
      },
      error: (err) => console.error('Update failed:', err)
    });
  }

  
  openSlipPreview(slipUrl: string) {
    
    const fullImageUrl = `http://localhost:8080${slipUrl}`;
    
    this.dialog.open(SlipPreviewDialog, {
      data: { imageUrl: fullImageUrl },
      panelClass: 'custom-dialog-container'
    });
  }
}


@Component({
  selector: 'slip-preview-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIcon],
  template: `
    <div style="position: relative; text-align: center; background: #000; padding: 10px;">
      <button mat-icon-button mat-dialog-close style="position: absolute; right: 10px; top: 10px; color: #fff; background: rgba(0,0,0,0.5); border: none; border-radius: 50%; cursor: pointer; padding: 5px;">
        <mat-icon>close</mat-icon>
      </button>
      <img [src]="data.imageUrl" style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 4px; margin-top: 20px;">
    </div>
  `
})
export class SlipPreviewDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }) {}
}