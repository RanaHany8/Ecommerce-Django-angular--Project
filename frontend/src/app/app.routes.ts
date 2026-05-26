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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'activate/:uid/:token', component: ActivateComponent },

 
  {
    path: 'admin',
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: UsersComponent },
      { path: 'products', component: Products }
    ]
  },

  { path: '**', redirectTo: '' },
];