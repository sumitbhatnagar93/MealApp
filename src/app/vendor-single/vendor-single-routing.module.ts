import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorSinglePage } from './vendor-single.page';

const routes: Routes = [
  {
    path: '',
    component: VendorSinglePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorSinglePageRoutingModule {}
