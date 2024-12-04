import { Component, OnInit } from '@angular/core';
import { Address, UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import {
  faAddressBook,
  faPlus,
  faSave,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { CartProduct, CartService } from '../../services/cart.service';
import { Order, OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  // FontAwesome icons
  faSave = faSave;
  faAddressBook = faAddressBook;
  faPlus = faPlus;
  faMinus = faMinus;

  cart: CartProduct[] = [];
  subtotal: number = 0;
  shipping: number = 5;
  total: number = 0;

  user: any;
  shippingOptions = [
    {
      id: 'normal',
      label: 'Standard Delivery',
      subLabel: 'Delivered within 6-10 business days',
      price: 5,
    },
    {
      id: 'express',
      label: 'Express Delivery',
      subLabel: 'Delivered within 2-4 business days',
      price: 10,
    },
    {
      id: 'next',
      label: 'Next Day Delivery',
      subLabel: 'Delivered within 1 business day',
      price: 25,
    },
  ];

  selectedShippingOption = this.shippingOptions[0]; // Default option

  order: Order = {
    shippingPrice: this.selectedShippingOption.price, // Set a default value for shippingPrice
    shippingAddress: {
      street: '',
      city: '',
      buildingName: '',
      flatNo: 0,
      floorNo: 0,
    },
    paymentMethod: 'cash', // Set a default value for paymentMethod
  };
  currentAddress: Address = {
    buildingName: '',
    city: '',
    flatNo: 0,
    floorNo: 0,
    street: '',
    details: '',
  };

  showAddAddressForm = false;

  imgUrl = 'https://mean-backend-eight.vercel.app/image/';

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.userService.user;
    this.cart = this.cartService.getCart();
    this.subtotal = this.cartService.getTotal();
    this.total = this.subtotal + this.shipping;
    this.updateTotal();
  }

  updateShipping(option: any): void {
    this.shipping = option.price;
    this.selectedShippingOption = option;
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.subtotal + this.shipping;
  }

  placeOrder(): void {
    this.orderService.addOrder(this.order).subscribe(
      (res) => {
        console.log(res);
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      (err) => {
        console.error('Failed to place order:', err);
      }
    );
  }

  addAddress(event: Event, form: any): void {
    event.preventDefault();

    if (form.valid) {
      this.userService.addAddress(this.currentAddress).subscribe(
        (res) => {
          console.log('Address added');
          this.userService.setCurrentUser(res);
          this.currentAddress = {
            buildingName: '',
            city: '',
            flatNo: 0,
            floorNo: 0,
            street: '',
            details: '',
          };
          this.showAddAddressForm = false;
        },
        (err) => console.error(err)
      );
    }
  }
}
