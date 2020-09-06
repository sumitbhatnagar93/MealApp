import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'home',
                loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
                data: {
                    preload: true
                },
            },
            {
                path: 'restaurant',
                loadChildren: () => import('../restaurant-list/restaurant-list.module').then(m => m.RestaurantListPageModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('../profile/account/account.module').then(m => m.AccountPageModule)
            },
            {
                path: '',
                redirectTo: '/tabs/home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
