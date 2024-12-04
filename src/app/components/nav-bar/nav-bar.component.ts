import { Component, OnInit, HostListener } from '@angular/core';
import { CartService, Product } from '../../services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faShoppingCart,
  faUser,
  faSearch,
  faBars,
  faTruckRampBox,
  faRightFromBracket,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { UserService } from '../../services/user.service';
import { CategoriesComponent } from '../categories/categories.component';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    CategoriesComponent,
    FormsModule,
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  user: any = null;
  isNavbarCollapsed = true;
  search = '';
  searchResults: Product[] = [];
  showSuggestions = false;
  lang = '';
  ShoppingCartIcon = faShoppingCart;
  UserIcon = faUser;
  SearchIcon = faSearch;
  BurgerIcon = faBars;
  TruckIcon = faTruckRampBox;
  logOutIcon = faRightFromBracket;
  settingIcon = faGear;

  constructor(
    public cartService: CartService,
    public language: LanguageService,
    private userService: UserService,
    private router: Router,
    private productsService: ProductsService // Inject the products service
  ) {}

  ngOnInit(): void {
    this.user = this.userService.user;
  }

  switchLanguage(lang: any) {
    const selectedLanguage = lang.target.value;
    this.language.changeLanguage(selectedLanguage);
  }
  getCurrentLang() {
    return this.language.getCurrentLanguageValue();
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  logout() {
    this.cartService.clearCartLocalStorage();
    this.userService.logout();
  }
  performSearch() {
    if (this.search.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.search },
      });
      this.showSuggestions = false; // Hide suggestions after form submission
    }
  }

  // New method to fetch search suggestions
  fetchSearchSuggestions() {
    if (this.search.trim()) {
      if (this.search.length >= 2) {
        this.productsService
          .getProductsBySort(null, null, this.search)
          .subscribe({
            next: (response) => {
              this.searchResults = response.products;
              this.showSuggestions = true; // Show suggestions when results are fetched
            },
            error: (err) => {
              console.error('Error fetching search results:', err);
              this.searchResults = [];
              this.showSuggestions = true; // Show no results message
            },
          });
      }
    } else {
      this.searchResults = [];
      this.showSuggestions = false; // Hide suggestions if search input is cleared
    }
  }

  // Method to handle when a suggestion is clicked
  selectSuggestion(product: any) {
    this.search = product.name; // Update search input with selected product name
    this.showSuggestions = false; // Hide suggestions after selection
  }
  // Show suggestions on input focus
  onFocus() {
    if (this.searchResults.length > 0) {
      this.showSuggestions = true;
    }
  }

  // Hide suggestions on input blur (clicking outside)
  onBlur() {
    setTimeout(() => {
      this.showSuggestions = false; // Delay to ensure the click is registered before hiding
    }, 300);
  }

  // Listener to detect clicks outside the input area
  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: any) {
    const clickedInside = targetElement.closest('form');

    if (!clickedInside) {
      this.showSuggestions = false; // Hide suggestions if clicked outside the form
    }
  }
}
