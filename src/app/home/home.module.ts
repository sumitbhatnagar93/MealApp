import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {HomePageRoutingModule} from './home-routing.module';

import {HomePage} from './home.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TiffinServicesPageModule} from '../tiffin-services/tiffin-services.module';
import {MapTestComponent} from '../map-test/map-test.component';
import {ManualLocationComponent} from '../components/manual-location/manual-location.component';
import {StrictModalComponent} from '../components/strict-modal/strict-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        FontAwesomeModule,
        TiffinServicesPageModule
    ],
    exports: [
        MapTestComponent,
    ],
    declarations: [HomePage, MapTestComponent, ManualLocationComponent, StrictModalComponent]
})
export class HomePageModule {
}
