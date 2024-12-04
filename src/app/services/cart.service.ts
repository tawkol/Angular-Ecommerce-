import { HttpClient, HttpHeaders } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { LanguageService } from './language.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

export type Product = {
  _id: string;
  name: string;
  price: number;
  img_urls: string;
  description: string;
  category?: string;
  show?: boolean;
  loading?: boolean;
};
export type CartProduct = Product & { quantity: number };

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.API_URL}/cart`;
  private cartSubject = new BehaviorSubject<CartProduct[]>(
    this.getCartFromLocalStorage()
  );
  cart$ = this.cartSubject.asObservable(); // Expose as an observable for components
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private translate: LanguageService
  ) {
    effect(() => {
      const user = this.userService.user();
      if (user) {
        this.initializeCart();
      } else {
        this.clearCartLocalStorage();
        this.cartSubject.next([]);
      }
    });
  }

  private initializeCart() {
    const headers = this.getAuthHeaders();
    if (headers) {
      this.cartDBActions.get();
    }
  }

  private getAuthHeaders(): HttpHeaders | null {
    const selectedLang = this.translate.getCurrentLanguageValue();
    const token = this.userService.user()?.token;
    if (!token) return null;
    return new HttpHeaders({
      'x-auth-token': token,
      'Accept-Language': selectedLang,
    });
  }

  cartDBActions = {
    get: () => {
      const headers = this.getAuthHeaders();
      if (!headers) return;
      this.http.get<CartProduct[]>(this.apiUrl, { headers }).subscribe({
        next: (cartItems) => {
          const products = cartItems;
          if (products.length == 0)
            return this.cartSubject.next(this.getCartFromLocalStorage());

          this.cartSubject.next(cartItems); // Update BehaviorSubject
          this.saveCartToLocalStorage(cartItems);
        },
        error: (error) => {
          console.error('Error fetching cart from DB', error);
        },
      });
    },
    add: (cartItem: { product: string; quantity: number }) => {
      const headers = this.getAuthHeaders();
      if (!headers) return;
      this.http.post(this.apiUrl, cartItem, { headers }).subscribe({
        next: () => console.log('Item added to cart in DB'),
        error: (err) => console.error('Error adding item to cart in DB', err),
      });
    },
    delete: (productId: string) => {
      const headers = this.getAuthHeaders();
      if (!headers) return;
      this.http.delete(`${this.apiUrl}/${productId}`, { headers }).subscribe({
        next: () => console.log('Item deleted from cart in DB'),
        error: (err) =>
          console.error('Error deleting item from cart in DB', err),
      });
    },
    clear: () => {
      const headers = this.getAuthHeaders();
      if (!headers) return;
      this.http.delete(`${this.apiUrl}/clear`, { headers }).subscribe({
        next: (res) => console.log('Cart cleared in DB', res),
        error: (err) => console.error('Error clearing cart', err),
      });
    },
  };

  private getCartFromLocalStorage(): CartProduct[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  private saveCartToLocalStorage(cart: CartProduct[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  clearCart(): void {
    this.clearCartLocalStorage();
    this.cartDBActions.clear();
  }

  clearCartLocalStorage(): void {
    this.cartSubject.next([]); // Clear the BehaviorSubject
    this.saveCartToLocalStorage([]);
  }

  addToCart(product: Product): void {
    const currentCart = this.cartSubject.value;
    const existingProduct = currentCart.find(
      (item) => item._id === product._id
    );
    if (existingProduct) {
      existingProduct.quantity++;
      const cartItem = {
        product: product._id,
        quantity: existingProduct.quantity,
      };
      this.cartDBActions.add(cartItem);
    } else {
      const newCart = [...currentCart, { ...product, quantity: 1 }];
      this.cartSubject.next(newCart);
      const cartItem = { product: product._id, quantity: 1 };
      this.cartDBActions.add(cartItem);
    }
    this.saveCartToLocalStorage(this.cartSubject.value);
  }

  getCart(): CartProduct[] {
    return this.cartSubject.value;
  }

  getCartItemCount(): number {
    return this.cartSubject.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  incrementProduct(id: string): void {
    const currentCart = this.cartSubject.value;
    const product = currentCart.find((item) => item._id === id);
    if (product) {
      product.quantity++;
      this.cartSubject.next([...currentCart]); // Emit updated value
      const cartItem = { product: product._id, quantity: product.quantity };
      this.cartDBActions.add(cartItem);
      this.saveCartToLocalStorage(currentCart);
    }
  }

  decrementProduct(id: string): void {
    const currentCart = this.cartSubject.value;
    const product = currentCart.find((item) => item._id === id);
    if (product) {
      product.quantity--;
      if (product.quantity <= 0) {
        console.log(product);
        this.deleteProduct(product);
      } else {
        this.cartSubject.next([...currentCart]);
        const cartItem = { product: product._id, quantity: product.quantity };
        this.cartDBActions.add(cartItem);
        this.saveCartToLocalStorage(currentCart);
      }
    }
  }

  deleteProduct(product: CartProduct): void {
    const currentCart = this.cartSubject.value.filter(
      (item) => item._id !== product._id
    );
    this.cartSubject.next(currentCart); // Update BehaviorSubject
    this.saveCartToLocalStorage(currentCart); // Update Local Storage

    // Sync delete with DB
    this.cartDBActions.delete(product._id);
  }

  getTotal(): number {
    return this.cartSubject.value.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }
}
