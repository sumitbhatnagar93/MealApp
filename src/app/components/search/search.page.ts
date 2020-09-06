import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {IonInput, ModalController} from '@ionic/angular';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

    constructor(private modalCtrl: ModalController, private element: ElementRef) {
    }

    @ViewChild('searchInput', {static: false}) inputElement: IonInput;


    ngOnInit() {
        setTimeout(() => {
            this.inputElement.setFocus();
        }, 400);

    }

    dismiss() {
        this.modalCtrl.dismiss();
    }
}
