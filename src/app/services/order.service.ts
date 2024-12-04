import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Address, UserService } from './user.service';
import { Observable } from 'rxjs';
import { LanguageService } from './language.service';
import { CartProduct } from './cart.service';

export type Order = {
  _id?: string;
  shippingPrice?: number;
  shippingAddress: Address;
  paymentMethod?: string;
  payment?: { paymentMethod: string; paymentStatus: string };
  totalAmount?: number;
  products?: CartProduct[];
  status?: string;
  createdAt?: Date;
};

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.API_URL}/order`;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private translate: LanguageService
  ) {}
  private getAuthHeaders(): HttpHeaders | null {
    const selectedLang = this.translate.getCurrentLanguageValue();
    const token = this.userService.user()?.token;
    if (!token) return null;
    return new HttpHeaders({
      'x-auth-token': token,
      'Accept-Language': selectedLang,
    });
  }

  getOrders(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('Authorization token is missing');
    }
    return this.http.get(this.apiUrl, { headers });
  }

  getOrderById(id: string): Observable<any> | null {
    const headers = this.getAuthHeaders();
    if (!headers) return null;
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  addOrder(order: Order): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('Authorization token is missing');
    }
    return this.http.post(this.apiUrl, order, { headers });
  }
}
