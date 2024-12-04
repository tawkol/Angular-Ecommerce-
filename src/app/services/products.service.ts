import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageService } from './language.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // private apiUrl = 'http://localhost:3000/api/prod';
  // private apiUrl = 'https://399927ac-8305-4421-a6b5-998700edb803-00-cl7snndaq9sj.worf.replit.dev/api/prod';
  private apiUrl = `${environment.API_URL}/prod`;

  constructor(public http: HttpClient, public translate: LanguageService) {}
  private getHeaders(): HttpHeaders {
    const selectedLang = this.translate.getCurrentLanguageValue();
    return new HttpHeaders().set('Accept-Language', selectedLang);
  }

  getProducts(page: number = 1, limit: number = 10): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/?page=${page}&limit=${limit}`;

    return this.http.get(url, { headers });
  }

  getProductById(id: string): Observable<any> {
    const headers = this.getHeaders();

    const url = `${this.apiUrl}/${id}`;

    return this.http.get(url, { headers });
  }

  getNewProducts(): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/randomProducts`;

    return this.http.get(url, { headers });
  }

  addProduct(productData: any, images: File[]): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('name_en', productData.name_en);
    formData.append('name_ar', productData.name_ar);
    formData.append('description_en', productData.description_en);
    formData.append('description_ar', productData.description_ar);
    formData.append('price', productData.price);
    formData.append('category_en', productData.category_en);
    formData.append('category_ar', productData.category_ar);
    formData.append('show', productData.show ? 'true' : 'false');

    // Append multiple image files to the FormData
    images.forEach((image, index) => {
      formData.append('prodimg', image, image.name);
    });

    // Make a POST request to add the new product with images
    return this.http.post(this.apiUrl, formData);
  }

  getCategories(): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/categories`;

    return this.http.get(url, { headers });
  }
  getProductsByCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/category/${category}?page=${page}&limit=${limit}`;

    return this.http.get(url, { headers });
  }

  getProductsBySort(
    sort_by: string | null,
    category: string | null,
    search: string | null,
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    const headers = this.getHeaders();
    if (sort_by === null) sort_by = '';
    if (category === null) category = '';
    if (search === null) search = '';
    const urlQuery = `?sort_by=${sort_by}&category=${category}&search=${search}&page=${page}&limit=${limit}`;
    const url = `${this.apiUrl}/searchsort${urlQuery}`;
    return this.http.get(url, { headers });
  }
}
