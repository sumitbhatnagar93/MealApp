import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {GoogleMapPageRoutingModule} from './google-map-routing.module';

import {GoogleMapPage} from './google-map.page';
import {HomePageModule} from '../../home/home.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GoogleMapPageRoutingModule,
        HomePageModule
    ],
    declarations: [GoogleMapPage]
})
export class GoogleMapPageModule {
}
