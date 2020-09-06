import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CookreyVendorService} from '../services/cookrey-vendor.service';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {ModalController, ToastController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {SearchPage} from '../components/search/search.page';
import {ProductEnhaceComponent} from '../components/product-enhace/product-enhace.component';

@Component({
    selector: 'app-vendor-single',
    templateUrl: './vendor-single.page.html',
    styleUrls: ['./vendor-single.page.scss'],
})
export class VendorSinglePage implements OnInit {
    isLoaded: boolean;
    VendorId: string;
    products: any[] = [];
    vendorInfo: [];
    filePathLive = 'https://cookrey.com/images/restaurants/';
    filePathTest = 'http://laravel.test/images/restaurants/';
    cart: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private vendorService: CookreyVendorService,
        private nativeStorage: NativeStorage,
        public toast: ToastController,
        private modal: ModalController
    ) {
        this.isLoaded = true;
    }

    ngOnInit() {
        this.VendorId = this.route.snapshot.paramMap.get('id');
        setTimeout(() => {
            this.isLoaded = false;
        }, 1000);
        this.getVendorById();
        this.getProductByVendorId();

        this.nativeStorage.getItem('cookreyCart').then((res) => {
            console.log(res);
            this.cart = res;
        });
    }

    getVendorById() {
        this.vendorService.getProductByVendor(this.VendorId).subscribe((result) => {
            // console.log('vendor', result);
            this.vendorInfo = result[0];
        }, (error) => {
            console.log(error);
        });
    }

    getProductByVendorId() {
        this.vendorService.getProductByVendorId(this.VendorId).subscribe((result) => {
            // console.log(result);
            this.products = result;
            for (const value of this.cart) {
                const index = this.products.findIndex(({id}) => id === value.id);
                this.products[index].qty = value.qty;
            }
        }, (error) => {
            console.log(error);
        });
    }

    getProductByProductId() {
        this.vendorService.getProductByProductId(this.VendorId).subscribe((result) => {
            console.log(result);
            this.products = result;
        }, (error) => {
            console.log(error);
        });
    }

    addToCart(product) {
        const productExistInCart = this.cart.find(({id}) => id === product.id); // find product by id
        const index = this.products.findIndex(({id}) => id === product.id);

        if (!productExistInCart) {
            if (product.subtotal) {
                this.cart.push({...product, qty: 1});
            } else {
                this.cart.push({...product, qty: 1, subtotal: product.price});
            }
            this.products[index].qty = 1;
        } else {
            productExistInCart.qty += 1;
            product.qty = productExistInCart.qry;
            productExistInCart.subtotal = productExistInCart.qty * productExistInCart.price;

            this.products[index].qty = productExistInCart.qty;

            this.cart = this.cart.filter(({id}) => id !== productExistInCart.id);
            this.cart.push(productExistInCart);
        }
        this.nativeStorage.setItem('cookreyCart', this.cart).then((data) => {
            console.log(data);
            this.shwoCartSummary(data);
        });

    }

    removeItem(product) {
        const productExistInCart = this.cart
            .find(({id}) => id === product.id); // find product by id
        const index = this.products.findIndex(({id}) => id === product.id);
        if (productExistInCart) {
            if (productExistInCart.qty > 1) {
                productExistInCart.qty -= 1;
                productExistInCart.subtotal = productExistInCart.qty * productExistInCart.price;
                this.products[index].qty = productExistInCart.qty;
                this.cart = this.cart
                    .filter(({id}) => id !== productExistInCart.id);
                this.cart.push(productExistInCart);
            } else {
                this.products[index].qty = 0;
                this.cart = this.cart.filter(({id}) => id !== product.id);
            }
            this.nativeStorage.setItem('cookreyCart', this.cart).then((data) => {
                console.log(data);
                this.shwoCartSummary(data);
            });
        }
    }

    async shwoCartSummary(data) {
        const count = data.reduce((acc, prod) => acc += prod.qty, 0);
        const amount = data.reduce((acc, prod) => acc += prod.subtotal, 0);
        const toast = await this.toast.create({
            message: '<div class="row">' + count + ' Items</div><div class="row">Rs. ' + amount + ' + taxes</div>',
            position: 'bottom',
            color: 'danger',
            buttons: [
                {
                    text: 'View Cart',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        toast.present();
    }


    async presentToatWithOptions(product) {
        const extra = JSON.parse(product.extra);
        console.log(extra);
        const modal = await this.modal.create({
            component: ProductEnhaceComponent,
            cssClass: 'min-half-modal',
            componentProps: {
                'product': product,
            },
        });
        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned !== null) {
                this.addToCart(dataReturned.data);
            }
        });
        return await modal.present();
    }
}
