import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {VendorSinglePageRoutingModule} from './vendor-single-routing.module';

import {VendorSinglePage} from './vendor-single.page';
import {ProductEnhaceComponent} from '../components/product-enhace/product-enhace.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        VendorSinglePageRoutingModule
    ],
    declarations: [VendorSinglePage, ProductEnhaceComponent]
})
export class VendorSinglePageModule {
}
