import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../services/cart.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [SpinnerComponent, CurrencyPipe, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  imgUrl = 'https://mean-backend-eight.vercel.app/image/';
  @Input() product!: Product;

  @Output() addToCart = new EventEmitter<Product>();
  addItem(): void {
    if (!this.product.loading) {
      this.product.loading = true;
      this.addToCart.emit(this.product);
    }
  }
}
