import { Routes } from '@angular/router';
import { ActivateComponent } from './pages/activate/activate.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { SellerWalletComponent } from './pages/seller-wallet/seller-wallet.component';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { UsersComponent } from './pages/admin/users/users';
import { Products } from './pages/admin/products/products';
import { PromoCodes } from './pages/admin/promo-codes/promo-codes.page';
import { adminGuard } from './guards/admin.guard';
import { SellerDashboardComponent } from './pages/seller-dashboard/seller-dashboard.component';
import { SellerPayoutsComponent } from './pages/seller-payouts/seller-payouts.component';
<<<<<<< HEAD

import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderService } from './services/order.service';
import { OrdersComponent } from './pages/orders/orders.component';
import { TrackingComponent } from './pages/tracking/tracking.component';

import { SellerPaymentsComponent } from './pages/seller-payments/seller-payments.component';
import { SellerEarningsComponent } from './pages/seller-earnings/seller-earnings.component';
import { SellerProductsComponent } from './pages/seller-products/seller-products.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'wishlist', component: WishlistComponent },
  {
    path: 'seller-payouts',
    component: SellerPayoutsComponent,
  },
  { path: 'activate/:uid/:token', component: ActivateComponent },

  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: UsersComponent },
      { path: 'products', component: Products },
      { path: 'promo-codes', component: PromoCodes },
    ],
  },


  { path: 'seller-dashboard', component: SellerDashboardComponent },
  
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrdersComponent, providers: [OrderService] },
  { path: 'tracking/:id', component: TrackingComponent },

  {
    path: 'seller-dashboard',
    component: SellerDashboardComponent,
  },

  {
    path: 'seller-payouts',
    component: SellerPayoutsComponent,
  },

  {
    path: 'seller-payments',
    component: SellerPaymentsComponent,
  },
  {
    path: 'seller-wallet',
    component: SellerWalletComponent,
  },
  {
    path: 'seller-earnings',
    component: SellerEarningsComponent,
  },
  {
    path: 'seller-products',
    component: SellerProductsComponent,
  },
  {
    path: 'seller-products/edit/:id',
    component: EditProductComponent,
  },


  { path: '**', redirectTo: '' },
];
