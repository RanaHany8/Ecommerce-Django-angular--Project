import { Routes } from '@angular/router';
import { ActivateComponent } from './pages/activate/activate.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';

import { Dashboard } from './pages/admin/dashboard/dashboard';
import { UsersComponent } from './pages/admin/users/users';
import { Products } from './pages/admin/products/products';
import { PromoCodes } from './pages/admin/promo-codes/promo-codes.page';
import { adminGuard } from './guards/admin.guard';
import { SellerDashboardComponent } from './pages/seller-dashboard/seller-dashboard.component';
import { SellerPayoutsComponent } from './pages/seller-payouts/seller-payouts.component';

import { CartComponent } from './pages/cart/cart.component';


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
      {
        path: 'seller-payouts',
        component: SellerPayoutsComponent,
      },
    ],
  },

  { path: 'seller-dashboard', component: SellerDashboardComponent },
  { path: 'cart', component: CartComponent },
  

  { path: '**', redirectTo: '' },
];
