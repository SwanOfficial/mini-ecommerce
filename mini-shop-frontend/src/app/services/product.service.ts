import { computed, Injectable, signal } from "@angular/core";
import { Product } from "../models/product.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root' 
})
export class ProductService {
  private dbUrl = 'http://localhost:8080/api/products';

  products = signal<Product[]>([]);
  searchProduct = signal<string>('');

  constructor(private http: HttpClient) {}

  fetchProducts() {
    this.http.get<Product[]>(this.dbUrl).subscribe(data => {
      this.products.set(data); 
    });
  }

  filteredProducts = computed(() => {
    const query = this.searchProduct().toLowerCase();
    return this.products().filter(p => 
      p.name.toLowerCase().includes(query)
    );
  });

  
  addProduct(formData: FormData) {
    return this.http.post<Product>(this.dbUrl, formData);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.dbUrl}/${id}`);
  }

  
  updateProduct(id: number, formData: FormData) {
    return this.http.put<Product>(`${this.dbUrl}/${id}`, formData);
  }

 
  totalRevenue = computed(() => {
    return this.products().reduce((sum, p) => sum + (p.price || 0), 0);
  });
}