import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    constructor(private loader: LoadingController) {
    }

    async presentAutoTimerLoading() {
        const loading = await this.loader.create({
            cssClass: 'theme-preloader',
            translucent: true,
            spinner: 'bubbles',
            duration: 2000,
        });
        await loading.present();

        const {role, data} = await loading.onDidDismiss();
    }

    async presentLoading() {
        const loading = await this.loader.create({
          //  cssClass: 'theme-preloader',
           // translucent: true,
            spinner: 'circular',
        });
        await loading.present();

        const {role, data} = await loading.onDidDismiss();
    }

    dismiss() {
        this.loader.dismiss().then((res) => {
            console.log('Loading dismissed!', res);
        }).catch((error) => {
            console.log('error - ', error);
        });
    }
}
