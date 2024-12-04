import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CartService, Product } from '../../services/cart.service';
import { ToastComponent } from '../toast/toast.component';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CardComponent,
    ToastComponent,
    SpinnerComponent,
    FontAwesomeModule,
    CommonModule,
    CarouselModule,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  product!: Product;
  similarProducts!: Product[];
  toastVisible = false;
  id!: Product['_id'];
  imgUrl = 'https://mean-backend-eight.vercel.app/image/';

  imageIndex: number = 0; // Initial image index
  icons = {
    left: faAngleLeft,
    right: faAngleRight,
  };
  carouselOptions = {
    margin: 10, // Adjust the margin between slides
    responsive: {
      0: {
        items: 1, // Show 1 item for mobile
      },
      480: {
        items: 2, // Show 2 items for small screens
      },
      768: {
        items: 3, // Show 3 items for medium screens
      },
      1024: {
        items: 4, // Show 4 items for large screens
      },
    },
  };

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = String(params.get('product')); // Get the product id from route params

      // Refetch product data whenever the id changes
      this.fetchProductById(this.id);
    });
  }

  fetchProductById(id: Product['_id']): void {
    this.productsService.getProductById(id).subscribe(
      (data) => {
        this.product = data;
        this.imageIndex = 0;
        if (this.product.category) {
          this.fetchSimilarProducts(this.product.category);
        }
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  fetchSimilarProducts(category: string) {
    this.productsService
      .getProductsByCategory(category, 1, 10)
      .subscribe((data) => {
        this.similarProducts = data.products;
      });
  }

  addToCart(product: Product = this.product) {
    this.cartService.addToCart(product);
    product.loading = true;

    setTimeout(() => {
      product.loading = false;
      this.toastVisible = true;

      setTimeout(() => {
        this.toastVisible = false;
      }, 3000);
    }, 1000);
  }

  // Method to go to the next image
  nextImage(): void {
    if (
      this.product.img_urls &&
      this.imageIndex < this.product.img_urls.length - 1
    ) {
      this.imageIndex++;
    }
  }

  // Method to go to the previous image
  prevImage(): void {
    if (this.imageIndex > 0) {
      this.imageIndex--;
    }
  }
  setImageIndex(index: number) {
    this.imageIndex = index;
  }
}
