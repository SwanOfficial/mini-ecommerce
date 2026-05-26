import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatProgressSpinnerModule,MatIcon  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
})
export class ProductList implements OnInit {

  productService= inject(ProductService);
  cartService= inject(CartService);

  ngOnInit(){
    this.productService.fetchProducts();

  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
  
}
