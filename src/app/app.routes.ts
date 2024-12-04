import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductComponent } from './components/product/product.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { authGuard } from './auth.guard';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrdersComponent } from './components/order/order.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent }, // All products
  { path: 'products/category/:category', component: ProductsComponent },
  // { path: 'products/:search', component: ProductsComponent },
  { path: 'product/:product', component: ProductComponent },
  {
    path: 'user-account',
    component: UserAccountComponent,
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: '' },
];
