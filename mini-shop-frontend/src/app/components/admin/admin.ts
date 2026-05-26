import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { OrderAdmin } from './order-admin/order-admin';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../services/order.services';
import { ChartData } from 'chart.js';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';



@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, OrderAdmin, MatCardModule,     
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,BaseChartDirective],
    providers: [
    provideCharts(withDefaultRegisterables()) 
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin implements OnInit {
      productService = inject(ProductService);
      orderService = inject(OrderService);

  ngOnInit() {
    this.productService.fetchProducts(); 
    this.orderService.fetchOrders();
    this.loadChartData();
  }

  onAddProduct(form: any) {
    if (form.invalid) return;

    this.productService.addProduct(form.value).subscribe({
      next: () => {
        alert('Product Added Successfully!');
        form.reset(); 
        this.productService.fetchProducts(); 
      }
    });
  }

  onDelete(id: number) {
  if (confirm('Are you sure?')) {
    
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        alert('Deleted!');
        this.productService.fetchProducts(); 
      },
      error: (err) => console.error(err)
    });
  }
}

    isEditMode = false;
    currentEditId: number | null = null;

onEdit(product: any, form: any) {
  this.isEditMode = true;
  this.currentEditId = product.id;

  
  form.form.patchValue({
    name: product.name,
    price: product.price,
    stock: product.stock,
    description: product.description
    
  });

  
  this.imagePreview = product.imageUrl; 
  this.selectedFile = null; 
}


selectedFile: File | null = null;
imagePreview: string | ArrayBuffer | null = null;


onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}


onSubmit(form: any) {
  if (form.invalid) return;

  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('price', form.value.price);
  formData.append('description', form.value.description);
  formData.append('stock', form.value.stock);
  
  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  if (this.isEditMode && this.currentEditId !== null) {
    // Update Case
    this.productService.updateProduct(this.currentEditId, formData).subscribe({
      next: () => {
        alert('Updated Successfully!');
        this.resetForm(form);
      },
      error: (err) => console.error('Update failed', err)
    });
  } else {
    // Add Case
    this.productService.addProduct(formData).subscribe({
      next: () => {
        alert('Product Added!');
        this.resetForm(form);
      },
      error: (err) => console.error('Add failed', err)
    });
  }
}


resetForm(form: any) {
  form.reset();
  this.isEditMode = false;
  this.currentEditId = null;
  this.selectedFile = null;
  this.imagePreview = null; 
  this.productService.fetchProducts();
}

  onCancel(form: any) {
  this.isEditMode = false;
  this.currentEditId = null;
  form.reset();
}

public lineChartData: ChartData<'line'> = {
    datasets: [
      {
        data: [],
        label: 'Daily Revenue (MMK)',
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        fill: 'origin',
        tension: 0.4
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true }
    }
  };

  

  loadChartData() {
    this.orderService.getDailyRevenueStats().subscribe({
      next: (res) => {
        this.lineChartData.labels = res.map(item => item.date);
        this.lineChartData.datasets[0].data = res.map(item => item.amount);
      },
      error: (err) => console.error('Failed to load chart data', err)
    });
  }
      
 }

