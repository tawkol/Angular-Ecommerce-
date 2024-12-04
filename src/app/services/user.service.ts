import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Address {
  buildingName: string;
  city: string;
  flatNo: number;
  floorNo: number;
  street: string;
  details?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.API_URL}/`; // Base API URL from environment

  // Signal to manage the user state
  user = signal<any | null>(this.getUserFromLocalStorage());

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the user object from local storage.
   */
  private getUserFromLocalStorage(): any | null {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    return null;
  }

  /**
   * Updates the user state and persists it in local storage.
   * @param user The user object to save, or `null` to clear it.
   */
  private updateUser(user: any | null): void {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    this.user.set(user); // Update the signal
  }

  /**
   * Logs out the user by clearing their state.
   */
  logout(): void {
    this.updateUser(null);
  }

  /**
   * Registers a new user.
   * @param user The registration details.
   */
  register(user: {
    name: string;
    email: string;
    password: string;
    phone: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}user`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  /**
   * Logs in a user and returns a token and user details.
   * @param credentials The login credentials (email and password).
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}auth`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  /**
   * Deletes the current user by ID.
   * @param userId The user ID to delete.
   */
  deleteUser(): Observable<any> {
    const token = this.getAuthToken();
    return this.http.delete(`${this.apiUrl}auth`, {
      headers: new HttpHeaders({
        ...(token && { 'x-auth-token': token }),
      }),
    });
  }

  addAddress(address: Address): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'x-auth-token': token }), // Include token header only if it exists
    });

    return this.http.patch(
      `${this.apiUrl}auth/address`,
      { address },
      { headers }
    );
  }

  updateAddress(updatedAddress: Address, index: number): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'x-auth-token': token }),
    });

    return this.http.patch(
      `${this.apiUrl}auth/address/update`,
      { updatedAddress, addressIndex: index },
      { headers }
    );
  }

  deleteAddress(index: number): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'x-auth-token': token }),
    });

    return this.http.patch(
      `${this.apiUrl}auth/address/remove`,
      { index },
      { headers }
    );
  }

  /**
   * Simulates setting the logged-in user state.
   * @param user The logged-in user data.
   */
  setCurrentUser(user: any): void {
    this.updateUser(user);
  }

  /**
   * Gets the current logged-in user state synchronously.
   */
  get currentUser(): any | null {
    return this.user();
  }

  /**
   * Retrieves the JWT token from local storage or returns `null`.
   */
  private getAuthToken(): string | undefined {
    const user = this.currentUser;
    return user?.token || undefined;
  }
}
