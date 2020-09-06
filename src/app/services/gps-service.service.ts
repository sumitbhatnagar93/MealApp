import {Injectable} from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import {Network} from '@ionic-native/network/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';
import {LoaderService} from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class GpsServiceService {
    locationCoords: any;
    timetest: any;
    address: string;
    latestData = {address: '', lat: '', lng: ''};
    isGPSOn: boolean;

    constructor(
        private platform: Platform,
        public modalController: ModalController,
        private network: Network,
        private androidPermissions: AndroidPermissions,
        private geolocation: Geolocation,
        private locationAccuracy: LocationAccuracy,
        private nativeGeocoder: NativeGeocoder,
        private nativeStorage: NativeStorage,
        private timerLoader: LoaderService
    ) {
        this.locationCoords = {
            latitude: '',
            longitude: '',
            accuracy: '',
            timestamp: ''
        };
        this.timetest = Date.now();
    }


    checkGPSPermission() {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
            result => {
                if (result.hasPermission) {

                    this.askToTurnOnGPS();
                } else {

                    this.requestGPSPermission();
                }
            },
            err => {
                alert(err);
            }
        );
    }

    requestGPSPermission() {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                console.log('4');
            } else {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
                    .then(
                        () => {
                            // call method to turn on GPS
                            this.askToTurnOnGPS();
                        },
                        error => {
                            alert('requestPermission Error requesting location permissions ' + error);
                        }
                    );
            }
        });
    }

    askToTurnOnGPS() {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
                this.modalController.dismiss();
                // When GPS Turned ON call method to get Accurate location coordinates
                this.getLocationCoordinates();
            },
            error => alert('Error requesting location permissions ' + JSON.stringify(error))
        );
    }

    getLocationCoordinates() {
        this.geolocation.getCurrentPosition().then((resp) => {
            this.nativeStorage.setItem('currentLatLang', {
                latitude: resp.coords.latitude,
                longitude: resp.coords.longitude
            }).then(() => {
                this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude, true);
                window.dispatchEvent(new CustomEvent('changeMapToCurrent'));
            }, (error) => {
                alert('unable to set location' + JSON.stringify(error));
            });
            this.locationCoords.latitude = resp.coords.latitude;
            this.locationCoords.longitude = resp.coords.longitude;
            this.locationCoords.accuracy = resp.coords.accuracy;
            this.locationCoords.timestamp = resp.timestamp;
        }).catch((error) => {
            alert('Error getting location' + error);
        });
    }

    getAddressFromCoords(lattitude, longitude, isLoader = true) {
        let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
        };
        return this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
            .then((result: NativeGeocoderResult[]) => {
                this.address = '';
                let responseAddress = [];
                for (let [key, value] of Object.entries(result[0])) {
                    if (value.length > 0) {
                        responseAddress.push(value);
                    }
                }
                responseAddress.reverse();
                for (let value of responseAddress) {
                    this.address += value + ', ';
                }
                this.address = this.address.slice(0, -2);
                this.saveAddressData(this.address, lattitude, longitude, isLoader);
            })
            .catch((error: any) => {
                this.address = 'Address Not Available!';
                this.saveAddressData(this.address, null, null, isLoader);
                return false;
            });

    }

    saveAddressData(adsress, lattitude, longitude, isLoader) {
        this.nativeStorage.setItem('selectedAddress', {
            address: this.address,
            lat: lattitude,
            lng: longitude
        }).then((res) => {
            window.dispatchEvent(new CustomEvent('refreshEvent'));
            console.log('isload', isLoader);
            if (isLoader) {
               // this.timerLoader.presentLoading();
            }
        });
    }
}
