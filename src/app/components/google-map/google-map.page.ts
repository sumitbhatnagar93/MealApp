import {Component, NgZone, OnInit} from '@angular/core';
import {
    CameraPosition, Circle, Geocoder,
    GoogleMap,
    GoogleMaps,
    GoogleMapsAnimation,
    GoogleMapsEvent, LatLng,
    Marker,
    MyLocation
} from '@ionic-native/google-maps/ngx';
import {ModalController, Platform, ToastController} from '@ionic/angular';
import {GpsServiceService} from '../../services/gps-service.service';
import {LoaderService} from '../../services/loader.service';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {ManualLocationComponent} from '../manual-location/manual-location.component';
import {Router} from '@angular/router';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';

@Component({
    selector: 'app-google-map',
    templateUrl: './google-map.page.html',
    styleUrls: ['./google-map.page.scss'],
})
export class GoogleMapPage implements OnInit {

    map: GoogleMap;
    address: string;
    isMapLoaded: boolean;
    lat: number;
    lng: number;
    currentLatitude: number;
    currentLongitude: number;

    constructor(
        private platform: Platform,
        private diagnose: Diagnostic,
        public modalController: ModalController,
        public GPSService: GpsServiceService,
        private timerLoader: LoaderService,
        public nativeStorage: NativeStorage,
        private route: Router,
        private geolocation: Geolocation,
        private ngZone: NgZone
    ) {
        this.isMapLoaded = false;
    }

    ionViewDidEnter() {
        // Since ngOnInit() is executed before `deviceready` event,
        // you have to wait the event.
        this.platform.ready().then(() => {
            this.loadAddress();
            window.addEventListener('refreshEvent', () => {
                this.loadAddress();
            });
            window.addEventListener('changeMap', () => {
                this.nativeStorage.getItem('latlng').then((res) => {
                    this.lat = res.lat;
                    this.lng = res.lng;

                    this.map.animateCamera({
                        target: {
                            lat: this.lat,
                            lng: this.lng
                        },
                        zoom: 18,
                        duration: 1000
                    });
                });
            });
            window.addEventListener('changeMapToCurrent', () => {
                this.nativeStorage.getItem('currentLatLang').then((res) => {
                    this.currentLatitude = res.latitude;
                    this.currentLongitude = res.longitude;

                    this.map.animateCamera({
                        target: {
                            lat: this.currentLatitude,
                            lng: this.currentLongitude
                        },
                        zoom: 18,
                        duration: 1000
                    });
                });
            });
            this.nativeStorage.getItem('latlng').then((res) => {
                this.lat = res.lat;
                this.lng = res.lng;
                console.log('onGet - ', this.lat, this.lng);
                this.loadMap();
            });
        });
    }

    ngOnInit() {
    }

    loadAddress() {
        this.ngZone.run(() => {
            this.nativeStorage.getItem('selectedAddress').then((data) => {
                const address = data.address.substring(0, 35) + '...';
                this.address = address;
                console.log({address});
            });
        });

    }


    async presentManuallSearchModal() {
        const modal = await this.modalController.create({
            component: ManualLocationComponent,
            cssClass: 'min-half-modal'
        });
        return await modal.present();
    }

    loadMap() {
        const mapStyle = [
            {
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#dcdada'
                    }
                ]
            },
            {
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#f7f7f7'
                    },
                    {
                        'saturation': 35
                    },
                    {
                        'weight': 5
                    }
                ]
            },
            {
                'featureType': 'landscape',
                'stylers': [
                    {
                        'color': '#d9dbdd'
                    }
                ]
            },
            {
                'featureType': 'poi.park',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#a3e0b3'
                    }
                ]
            },
            {
                'featureType': 'road',
                'stylers': [
                    {
                        'color': '#fafafa'
                    },
                    {
                        'visibility': 'simplified'
                    }
                ]
            },
            {
                'featureType': 'road',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'color': '#ede3e3'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'stylers': [
                    {
                        'color': '#e4e47c'
                    }
                ]
            },
            {
                'featureType': 'road.highway',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'color': '#4b4b2a'
                    }
                ]
            },
            {
                'featureType': 'water',
                'stylers': [
                    {
                        'color': '#74aee2'
                    }
                ]
            }
        ];
        this.map = GoogleMaps.create('map_canvas', {
            camera: {
                target: {
                    lat: this.lat,
                    lng: this.lng
                },
                zoom: 18,
            },
            styles: mapStyle,
        });
        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            this.isMapLoaded = true;
        }, (er) => {
            console.log('unable to load map', er);
        });
        this.geolocation.watchPosition({enableHighAccuracy: true}).subscribe((locat) => {
            console.log(locat);
            this.currentLatitude = locat.coords.latitude;
            this.currentLongitude = locat.coords.longitude;
            console.log(this.currentLatitude, this.currentLongitude);
        }, (er) => {
            console.log(er);
        });
        this.goToMyLocation();
    }


    goToMyLocation() {
        // Get the location of you
        this.map.clear();
        this.map.setMyLocationEnabled(true);
        this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe((params: any[]) => {
            let cameraPosition: CameraPosition<LatLng> = params[0];
            console.log(cameraPosition);
            this.lat = cameraPosition.target.lat;
            this.lng = cameraPosition.target.lng;
            console.log('updated = ', this.lat, this.lng);
            this.GPSService.getAddressFromCoords(cameraPosition.target.lat, cameraPosition.target.lng, false);
            this.nativeStorage.setItem('latlng', {
                lat: this.lat,
                lng: this.lng
            }).then(() => {
                this.loadAddress();
            });
        });
        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
            (data) => {
                console.log('Click MAP', data);
            }
        );
    }

    showCurrentCoords() {
        // Move the map camera to the location with animation
        this.diagnose.isLocationEnabled().then(
            (isAvailable) => {
                console.log('Is available? ' + isAvailable);
                if (!isAvailable) {
                    this.GPSService.askToTurnOnGPS();
                }
            }).catch((e) => {
            console.log(e);
            alert(JSON.stringify(e));
        });
        this.map.animateCamera({
            target: {lat: this.currentLatitude, lng: this.currentLongitude},
            zoom: 18,
            duration: 500
        }).then(() => {
            this.map.setCameraTarget({lat: this.currentLatitude, lng: this.currentLongitude});
        });
    }

    confirmLocationEvent() {
        this.timerLoader.presentAutoTimerLoading().then(() => {
            this.route.navigate(['/tabs/home']);
            window.dispatchEvent(new CustomEvent('refreshEvent'));
        });
    }

}
