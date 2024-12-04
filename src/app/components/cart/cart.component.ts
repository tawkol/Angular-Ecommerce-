import { Component, OnInit } from '@angular/core';
import { CartService, CartProduct } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faMinus,
  faTrashAlt,
  faShoppingCart,
  faArrowRight,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: CartProduct[] = [];
  total: number = 0;
  imgUrl = 'https://mean-backend-eight.vercel.app/image/';
  // icons
  trashIcon = faTrashAlt;
  minusIcon = faMinus;
  plusIcon = faPlus;
  rightArrowIcon = faArrowRight;
  leftArrowIcon = faArrowLeft;
  cartIcon = faShoppingCart;

  constructor(public cartService: CartService) {}

  ngOnInit() {
    // Subscribe to cart observable for automatic updates
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.total = this.cartService.getTotal();
    });
  }

  deleteProduct(item: CartProduct) {
    this.cartService.deleteProduct(item);
  }

  incrementProduct(item: CartProduct) {
    this.cartService.incrementProduct(item._id);
  }

  decrementProduct(item: CartProduct) {
    this.cartService.decrementProduct(item._id);
  }
}
