import {Component, OnInit} from '@angular/core';
import {SearchPage} from '../components/search/search.page';
import {ModalController, Platform} from '@ionic/angular';
import {Network} from '@ionic-native/network/ngx';
import {LocationAlertComponent} from '../components/location-alert/location-alert.component';
import {GpsServiceService} from '../services/gps-service.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {ManualLocationComponent} from '../components/manual-location/manual-location.component';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    logo = './assets/images/logo-transparent.png';
    shadeLogo = './assets/images/shade-logo.png';
    selectedAddress: string;
    start = 0;
    currentModel = null;
    isOnline: boolean;
    isLoaded: boolean;

    constructor(
        private platform: Platform,
        public modalController: ModalController,
        private network: Network,
        public GPSService: GpsServiceService,
        public nativeStorage: NativeStorage,
    ) {
        this.isOnline = true;
        this.isLoaded = true;
    }

    ngOnInit() {
        window.addEventListener('onContentLoadEvent', () => {
            this.isLoaded = false;
        });
        this.initializeApp();
        this.getAddress();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            window.addEventListener('refreshEvent', () => {
                this.getAddress();
            });
            this.network.onDisconnect()
                .subscribe(() => {
                    this.isOnline = false;
                });
            this.network.onConnect()
                .subscribe(() => {
                    this.isOnline = true;
                });
        });
    }

    async getAddress() {
        this.nativeStorage.getItem('selectedAddress').then((data) => {
            console.log(data.address);
            data = data.address.substring(0, 35) + '...';
            this.selectedAddress = data;
        });
    }


    doRefresh(event) {
        console.log('Begin async operation');

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
            this.ngOnInit();
        }, 2000);
    }

    async presentSearchModal() {
        const modal = await this.modalController.create({
            component: SearchPage,
            cssClass: 'my-custom-class'
        });
        this.currentModel = modal;
        return await modal.present();
    }


    async presentMapModal() {
        const modal = await this.modalController.create({
            component: ManualLocationComponent,
            cssClass: 'min-half-modal'
        });

        modal.onDidDismiss().then((data) => {
            this.ngOnInit();
        });
        return await modal.present();
    }


}
