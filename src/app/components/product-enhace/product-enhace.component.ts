import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-product-enhace',
    templateUrl: './product-enhace.component.html',
    styleUrls: ['./product-enhace.component.scss'],
})
export class ProductEnhaceComponent implements OnInit {

    @Input() product: any;
    extra: any;
    selectAddons: any[] = [];

    constructor(
        private modal: ModalController) {
    }

    ngOnInit() {
        this.product.subtotal = this.product.price;
        console.log(this.product);
        this.extra = JSON.parse(this.product.extra);
        console.log(this.extra);

    }

    cartItem(name, price) {
        this.selectAddons.push({
            name,
            price
        });
        this.product.subtotal += parseInt(price);
        this.product.choosedExtra = this.selectAddons;
        console.log(this.product);
    }

    async addToCart() {
        await this.modal.dismiss(this.product);
    }
}
