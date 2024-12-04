import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderService } from '../../services/order.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = []; // Replace with appropriate type if needed
  isLoading = true;
  errorMessage: string | null = null;
  eyeIcon = faEye;
  imgUrl = 'https://mean-backend-eight.vercel.app/image/';

  constructor(private orderService: OrderService,
    private router: Router,
    private cartService: CartService,


  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getOrders().subscribe(
      (data: any) => {
        console.log(data);

        this.orders = data; // Adjust mapping if backend response structure differs
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load orders.';
        console.error(error);
        this.isLoading = false;
      }
    );
  }

}
