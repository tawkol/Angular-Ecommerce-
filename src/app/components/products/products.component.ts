import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';
import { faList, faTh } from '@fortawesome/free-solid-svg-icons';
import { CartService, Product } from '../../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../toast/toast.component';
import { CardComponent } from '../card/card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ToastComponent, CardComponent, FontAwesomeModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products!: Product[];
  currentPage = 1;
  totalPages = 1;
  totalProducts!: number;
  limit = 10;
  category: string | null = null;
  imgUrl = 'https://mean-backend-eight.vercel.app/image/';
  toastVisible = false;
  faList = faList;
  faGrid = faTh;
  isListView = false;
  sortBy = '';
  search: string | null = null;
  private langChangeSub!: Subscription;

  constructor(
    private productsService: ProductsService,
    private languageService: LanguageService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to language changes and fetch products accordingly
    this.langChangeSub = this.languageService.onLangChange.subscribe(() => {
      this.route.paramMap.subscribe((params) => {
        this.category = params.get('category');
        this.fetchProducts();
      });

      this.route.queryParams.subscribe((queryParams) => {
        this.search = queryParams['search'] || '';
        this.fetchProducts();
      });
    });
  }

  fetchProducts(page: number = 1): void {
    this.currentPage = page;

    if (this.sortBy || this.search) {
      this.fetchBySort();
    } else if (this.category) {
      this.fetchByCategory();
    } else {
      this.fetchAllProducts();
    }
  }

  fetchByCategory(): void {
    this.productsService
      .getProductsByCategory(this.category!, this.currentPage, this.limit)
      .subscribe({
        next: (response) => {
          this.setProductData(response);
        },
        error: () => {
          console.error('Error fetching products by category');
        },
      });
  }

  fetchAllProducts(): void {
    this.productsService.getProducts(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.setProductData(response);
      },
      error: () => {
        console.error('Error fetching all products');
      },
    });
  }

  fetchBySort(): void {
    this.productsService
      .getProductsBySort(
        this.sortBy,
        this.category,
        this.search,
        this.currentPage,
        this.limit
      )
      .subscribe({
        next: (response) => {
          this.setProductData(response);
        },
        error: () => {
          console.error('Error fetching products by sort');
        },
      });
  }

  setProductData(response: any): void {
    this.products = response.products;
    this.currentPage = response.currentPage;
    this.totalPages = response.totalPages;
    this.totalProducts = response.totalProducts;
  }

  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchProducts(page);
    }
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
    product.loading = true;

    setTimeout(() => {
      product.loading = false;
      this.toastVisible = true;

      setTimeout(() => {
        this.toastVisible = false;
      }, 3000); // Adjust time as needed
    }, 1000);
  }

  changeView(): void {
    this.isListView = !this.isListView;
  }

  getCurrentLang(): string {
    return this.languageService.getCurrentLanguageValue();
  }

  onSortChange(event: any): void {
    this.sortBy = event.target.value === 'featured' ? '' : event.target.value;
    this.fetchProducts(); // Fetch products again with the new sort order
  }
}
