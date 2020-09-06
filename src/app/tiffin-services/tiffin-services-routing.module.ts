import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiffinServicesPage } from './tiffin-services.page';

const routes: Routes = [
  {
    path: '',
    component: TiffinServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiffinServicesPageRoutingModule {}
