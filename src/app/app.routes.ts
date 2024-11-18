import {  Routes } from '@angular/router';
import { FilterdProductComponent } from './components/filterd-product/filterd-product.component';
import { HomeComponent } from './components/home/home.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { LoginComponent } from './components/login/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { CheckoutComponent } from './components/checkout/checkout/checkout.component';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods/payment-methods.component';
import { AuthGuard } from './guards/auth.guard';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard/user-dashboard.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { PaypalComponent } from './components/paypal/paypal.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { SearchedComponent } from './searched/searched.component';
import { DiscountedProductsComponent } from './components/discounted-products/discounted-products.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [

    // { path: 'sign-up', component: SignUpComponent },
    {
    path: '',
    component: MainLayoutComponent,
    children: [

    { path: '', component: HomeComponent }, 
    { path: 'home', component: HomeComponent, title: 'Home page' },
    { path: 'products/:subCategoryId', component: FilterdProductComponent }, 
    { path: 'product-details/:productId', component: ProductDetailsComponent } ,
    
    { path: 'checkout/paypal', component: PaypalComponent, title: 'checkout',canActivate: [AuthGuard] },
    // { path: 'checkout/home', component: HomeComponent, title: 'checkout'},
    { path: 'profile', component: UserDashboardComponent, title: 'profile', canActivate: [AuthGuard] },
    { path: 'sign-up/profile', component: UserDashboardComponent, title: 'profile', canActivate: [AuthGuard] },
    { path: 'whishlist', component: WishlistComponent, title: 'profile',  },
    { path: 'home/whishlist', component: WishlistComponent, title: 'profile',  },
    { path: 'search', component: SearchedComponent, title: 'search',  },
    { path: 'discount/:discountId', component: DiscountedProductsComponent, title: 'discounts',  },


]
},

    { path: 'sign-up', component: SignUpComponent, title: 'sign-up' },
    { path: 'login', component: LoginComponent, title: 'login' },
    { path: 'paypal', component: PaypalComponent, title: 'paypal' },
    { path: 'payment', component: PaymentMethodsComponent, title: 'payment', canActivate: [AuthGuard] },
    { path: 'login/payment', component: PaymentMethodsComponent, title: 'payment', canActivate: [AuthGuard] },
    { path: 'checkout', component: CheckoutComponent, title: 'checkout', canActivate: [AuthGuard] },
    { path: 'product-details', component: ProductDetailsComponent, title: 'product' },

    { path: '**', component: PageNotFoundComponent, title: '404 - Page Not Found' }






];
