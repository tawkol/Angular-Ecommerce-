import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { ProductsService } from '../../services/products.service';
import { Subscription } from 'rxjs';
import { CartService, Product } from '../../services/cart.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ToastComponent } from '../toast/toast.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCameraRetro,
  faStar,
  faPlane,
  faUsers,
  faThumbsUp,
  faBox,
} from '@fortawesome/free-solid-svg-icons';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateModule,
    SpinnerComponent,
    ToastComponent,
    CurrencyPipe,
    FontAwesomeModule,
    CommonModule,
    CardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  newProducts!: Product[];
  icons = {
    faCameraRetro,
    faStar,
    faPlane,
    faUsers,
    faThumbsUp,
    faBox,
  };
  imgUrl = 'https://mean-backend-eight.vercel.app/image/';

  private langChangeSub!: Subscription;
  toastVisible = false;
  constructor(
    public language: LanguageService,
    private productObj: ProductsService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.langChangeSub = this.language.onLangChange.subscribe(() => {
      this.fetchNewProducts();
    });
  }
  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }
  fetchNewProducts(): void {
    this.productObj.getNewProducts().subscribe((data) => {
      this.newProducts = data;
    });
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
    setTimeout(() => {
      product.loading = false;
      this.toastVisible = true;

      setTimeout(() => {
        this.toastVisible = false;
      }, 3000); // Adjust time as needed
    }, 1000);
  }
}
