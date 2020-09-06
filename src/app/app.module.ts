import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {Facebook} from '@ionic-native/facebook/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {GooglePlaceModule} from 'ngx-google-places-autocomplete';
import {Network} from '@ionic-native/network/ngx';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import {GoogleMaps} from '@ionic-native/google-maps';
import {File} from '@ionic-native/file/ngx';
import {Camera} from '@ionic-native/camera/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        GooglePlaceModule,
        BrowserModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        Facebook,
        GooglePlus,
        NativeStorage,
        Network,
        SpinnerDialog,
        AndroidPermissions,
        Geolocation,
        LocationAccuracy,
        NativeGeocoder,
        Diagnostic,
        GoogleMaps,
        File,
        Camera
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas, fab, far);
    }
}
