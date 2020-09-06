import {Component} from '@angular/core';

import {AlertController, ModalController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Location} from '@angular/common';
import {AuthService} from './auth/auth.service';
import {Environment} from '@ionic-native/google-maps/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {LocationAlertComponent} from './components/location-alert/location-alert.component';
import {StrictModalComponent} from './components/strict-modal/strict-modal.component';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private location: Location,
        public alertController: AlertController,
        private http: AuthService,
        private nativeStorage: NativeStorage,
        private modal: ModalController,
        private diagnose: Diagnostic,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString('#ffffff');
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.nativeStorage.getItem('selectedAddress').then(() => {
                // proceed forword
                this.diagnose.isLocationEnabled().then(
                    (isAvailable) => {
                        console.log('Is available? ' + isAvailable);
                        if (!isAvailable) {
                            this.presentLocationAlertModal();
                        }
                    }).catch((e) => {
                    console.log(e);
                });
            }, (er) => {
                this.presentStrictModal();
            });
            this.http.getToken();
            Environment.setEnv({
                // api key for server
                'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyD1fJmzwJMy35N0rfY_btipuz6f8_zFvZA',

                // api key for local development
                'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyD1fJmzwJMy35N0rfY_btipuz6f8_zFvZA'
            });
        });
        this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
            console.log('Back press handler!');
            if (this.location.isCurrentPathEqualTo('/tabs/home')) {

                // Show Exit Alert!
                console.log('Show Exit Alert!');
                this.showExitConfirm();
                processNextHandler();
            } else {

                // Navigate to back page
                console.log('Navigate to back page');
                this.location.back();

            }

        });

        this.platform.backButton.subscribeWithPriority(5, () => {
            console.log('Handler called to force close!');
            this.alertController.getTop().then(r => {
                if (r) {
                    navigator['app'].exitApp();
                }
            }).catch(e => {
                console.log(e);
            });
        });

    }

    async presentStrictModal() {
        const modal = await this.modal.create({
            component: StrictModalComponent,
            cssClass: 'strict-modal'
        });
        return await modal.present();
    }

    async presentLocationAlertModal() {
        const modal = await this.modal.create({
            component: LocationAlertComponent,
            cssClass: 'onetime-location-alert'
        });
        return await modal.present();
    }

    showExitConfirm() {
        this.alertController.create({
            header: 'App termination',
            message: 'Do you want to close the app?',
            backdropDismiss: false,
            buttons: [{
                text: 'Stay',
                role: 'cancel',
                handler: () => {
                    console.log('Application exit prevented!');
                }
            }, {
                text: 'Exit',
                handler: () => {
                    navigator['app'].exitApp();
                }
            }]
        })
            .then(alert => {
                alert.present();
            });
    }


}
