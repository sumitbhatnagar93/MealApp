import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {ModalController} from '@ionic/angular';
import {GpsServiceService} from '../../services/gps-service.service';
import {Route, Router} from '@angular/router';

declare var google;

@Component({
    selector: 'app-manual-location',
    templateUrl: './manual-location.component.html',
    styleUrls: ['./manual-location.component.scss'],
})
export class ManualLocationComponent implements OnInit {

    @ViewChild('map', {static: false}) mapElement: ElementRef;
    map: any;
    address: string;
    lat: string;
    long: string;
    autocomplete: { input: string; };
    autocompleteItems: any[];
    location: any;
    placeid: any;
    GoogleAutocomplete: any;


    constructor(
        public zone: NgZone,
        public nativeStorage: NativeStorage,
        public modalController: ModalController,
        public GPSService: GpsServiceService,
        private route: Router
    ) {
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
    }

    ngOnInit() {
    }

    turnONGPS() {
        this.GPSService.checkGPSPermission();
    }

    UpdateSearchResults() {
        if (this.autocomplete.input == '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({
                input: this.autocomplete.input,
                componentRestrictions: {
                    country: 'IN'
                }
            },
            (predictions, status) => {
                this.autocompleteItems = [];
                this.zone.run(() => {
                    predictions.forEach((prediction) => {
                        this.autocompleteItems.push(prediction);
                    });
                });
            });
    }

    SelectSearchResult(item) {
        console.log(JSON.stringify(item));
        this.placeid = item.place_id;
        this.geoCode(this.placeid);
    }

    geoCode(placeId) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({placeId: placeId}, (results, status) => {
            console.log(results);
            this.nativeStorage.setItem('latlng', {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            }).then(() => {
                this.modalController.dismiss();
                console.log('lat: ' + results[0].geometry.location.lat() + ', long: ' + results[0].geometry.location.lng());
                window.dispatchEvent(new CustomEvent('changeMap'));
                this.route.navigate(['/google-map']);
            });
        });
    }

    ClearAutocomplete() {
        this.autocompleteItems = [];
        this.autocomplete.input = '';
    }
}
