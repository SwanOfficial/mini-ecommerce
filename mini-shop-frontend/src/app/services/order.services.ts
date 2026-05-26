import { HttpClient, HttpHeaders } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root' 
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/orders';
  
  orders = signal<any[]>([]);

  totalRevenue = computed(() => 
    this.orders().reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  );

  totalOrdersCount = computed(() => this.orders().length);

  
  getDailyRevenueStats() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/stats/daily-revenue`, { headers });
  }

  placeOrder(orderData: any, slipFile: File) {
    const formData = new FormData();

   
    formData.append('order', JSON.stringify(orderData));

   
    formData.append('slip', slipFile);

    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.apiUrl, formData, { headers });
  }

  fetchOrders() {
    this.http.get<any[]>(this.apiUrl)
      .subscribe(res => this.orders.set(res));
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const statusPayload = { status: newStatus.toUpperCase() };
    return this.http.put(`${this.apiUrl}/${orderId}/status`, statusPayload, { headers });
  }

  getMyOrders(email: string) {
    return this.http.get<any[]>(`${this.apiUrl}/my-orders`, {
      params: { email: email }
    });
  }
}