import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

declare var google: any;

@Component({
    selector: 'app-map-test',
    templateUrl: './map-test.component.html',
    styleUrls: ['./map-test.component.scss'],
})
export class MapTestComponent implements OnInit {
    map: any;
    @ViewChild('map', {read: ElementRef, static: false}) mapElement: ElementRef;

    constructor() {
    }

    ngOnInit() {
        this.initMap();
    }

    initMap() {
        const cord = new google.maps.LatLng(45, 100);
        const mapOptions = {
            center: cord,
            zoom: 14,
            disableDefaultUI: true
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }

}
