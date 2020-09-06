import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'verification',
    loadChildren: () => import('./auth/verification/verification.module').then( m => m.VerificationPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./profile/account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./components/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'restaurant-list',
    loadChildren: () => import('./restaurant-list/restaurant-list.module').then( m => m.RestaurantListPageModule)
  },
  {
    path: 'tiffin-services',
    loadChildren: () => import('./tiffin-services/tiffin-services.module').then( m => m.TiffinServicesPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./components/forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'update-user',
    loadChildren: () => import('./components/update-user/update-user.module').then( m => m.UpdateUserPageModule)
  },
  {
    path: 'google-map',
    loadChildren: () => import('./components/google-map/google-map.module').then( m => m.GoogleMapPageModule)
  },
  {
    path: 'vendor-single/:id',
    loadChildren: () => import('./vendor-single/vendor-single.module').then( m => m.VendorSinglePageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
