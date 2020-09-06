import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TiffinServicesPageRoutingModule } from './tiffin-services-routing.module';

import { TiffinServicesPage } from './tiffin-services.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TiffinServicesPageRoutingModule
    ],
    exports: [
        TiffinServicesPage
    ],
    declarations: [TiffinServicesPage]
})
export class TiffinServicesPageModule {}
