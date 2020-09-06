import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {GpsServiceService} from '../../services/gps-service.service';
import {ManualLocationComponent} from '../manual-location/manual-location.component';

@Component({
    selector: 'app-location-alert',
    templateUrl: './location-alert.component.html',
    styleUrls: ['./location-alert.component.scss'],
})
export class LocationAlertComponent implements OnInit {

    constructor(
        public modalController: ModalController,
        public GPSService: GpsServiceService,
    ) {

    }

    ngOnInit() {
    }

    async showSearchModal() {
        const modal = await this.modalController.create({
            component: ManualLocationComponent,
            cssClass: 'min-half-modal'
        });

        modal.onDidDismiss().then((data) => {
            this.ngOnInit();
        });
        return await modal.present();
    }

    turnONGPS() {
        this.GPSService.checkGPSPermission();
    }

}
