import {Component, OnInit} from '@angular/core';
import {CookreyVendorService} from '../services/cookrey-vendor.service';
import {NativeStorage} from '@ionic-native/native-storage/ngx';

declare var google;

@Component({
    selector: 'app-tiffin-services',
    templateUrl: './tiffin-services.page.html',
    styleUrls: ['./tiffin-services.page.scss'],
})
export class TiffinServicesPage implements OnInit {
    isLoaded: boolean;
    cookreyVendors: any[] = [];
    latitude: any;
    longitude: any;
    filePathLive = 'https://cookrey.com/images/restaurants/';
    filePathTest = 'http://laravel.test/images/restaurants/';

    constructor(
        private vendorService: CookreyVendorService,
        public nativeStorage: NativeStorage,
    ) {
        this.isLoaded = false;
    }

    ngOnInit() {
        this.getSelectiveCoords();
        window.addEventListener('refreshEvent', () => {
            this.getSelectiveCoords();
        });
    }

    getSelectiveCoords() {
        this.nativeStorage.getItem('selectedAddress').then((data) => {
            this.latitude = data.lat;
            this.longitude = data.lng;
            this.getCookreyVendors();
        });
    }

    async getCookreyVendors() {
        this.vendorService.getCookreyVendors().subscribe((data) => {
            this.sortList(data, this.latitude, this.longitude).then(() => {
                window.dispatchEvent(new CustomEvent('onContentLoadEvent'));
                this.isLoaded = true;
            });
        }, (error) => {
            console.log(error);
        });
    }

    async sortList(data, lat, lng) {
        this.cookreyVendors = [];
        const geocoder = new google.maps.Geocoder();
        for (const value of data) {
            const from = new google.maps.LatLng(lat, lng);
            const to = new google.maps.LatLng(value.lat, value.lng);
            const dist = google.maps.geometry.spherical.computeDistanceBetween(from, to);
            const km = (dist / 1000).toFixed(1);
            if (parseInt(km) <= 5) {
                this.cookreyVendors.push(value);
            }
        }
    }
}
