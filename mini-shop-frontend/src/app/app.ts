import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { ProductList } from './components/product-list/product-list';
import { Cart } from './components/cart/cart';

@Component({
  selector: 'app-root',
  imports: [Header,RouterOutlet,RouterModule,Cart],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  
}
