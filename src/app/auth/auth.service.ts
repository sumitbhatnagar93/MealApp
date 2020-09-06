import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../_models/user';
import {map} from 'rxjs/operators';
import {ModalController, NavController} from '@ionic/angular';
import {Facebook} from '@ionic-native/facebook/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Router} from '@angular/router';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {AlertService} from '../alert-services/alert.service';
import {LoaderService} from '../services/loader.service';
import {SpinnerDialog} from '@ionic-native/spinner-dialog/ngx';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public API_URL = 'https://cookrey.com/';
    public API_URL2 = 'http://laravel.test/';
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    loginData = [];
    options: any;
    res: any;
    isLoggedIn = false;
    users = {id: 0, name: '', email: '', phone: '', token: '', picture: ''};
    token: any;
    userData: any = {};

    constructor(
        private http: HttpClient,
        public navCtrl: NavController,
        private route: Router,
        public fb: Facebook,
        private nativeStorage: NativeStorage,
        public googlePlus: GooglePlus,
        public modelCtr: ModalController,
        public toastService: AlertService,
        private loader: SpinnerDialog,
        private timerLoader: LoaderService
    ) {
        this.options = {
            headers: new HttpHeaders({
                Accept: 'application/json',
                'Content-Type': 'application/json'
            })
        };
    }


    googleSignIn() {
        this.googlePlus.login({})
            .then(result => {
                if (result && result.accessToken) {
                    this.timerLoader.presentAutoTimerLoading();
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.nativeStorage.setItem('token', result.accessToken)
                        .then(() => {
                            this.isLoggedIn = true;
                            this.users.email = result.email;
                            this.users.name = result.displayName;
                            this.users.id = result.userId;
                            window.dispatchEvent(new CustomEvent('refreshEvent'));
                            this.route.navigate(['/tabs/home']);
                            this.socialRegister(this.users);
                            this.token = result.accessToken;
                            this.toastService.presentAlertToast('Logged in successfully!');
                        }, error => {
                            alert('native storegae not working -' + JSON.stringify(error));
                        });
                }
            })
            .catch(err => {
                alert(JSON.stringify(err));
            });
    }

    login(username: string, password: string) {
        return this.http.post<any>(this.API_URL + 'api/oauth/login', {username, password})
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.nativeStorage.setItem('token', user.token)
                        .then(() => {
                            this.timerLoader.presentAutoTimerLoading();
                            this.isLoggedIn = true;
                            this.updateLocalStorage(user);
                            this.token = user.token;
                            window.dispatchEvent(new CustomEvent('refreshEvent'));
                        }, error => {
                            alert('native storegae not working -' + JSON.stringify(error));
                        });
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        this.fb.logout()
            .then(res => this.isLoggedIn = false)
            .catch(e => console.log('Error logout from Facebook', e));
        this.nativeStorage.remove('token').then(() => {
            this.nativeStorage.remove('currentUser');
            this.isLoggedIn = false;
            this.toastService.presentAlertToast('Logged out!');
        }, error => {
            alert('failed to logged out');
        });
    }

    sendOTP(data) {
        return this.http.post<any>('http://13.233.167.234/sendOTP', data, this.options);
    }

    updateLoginData(res) {
        this.loginData = [];
        this.loginData.push({otp: res.otp, phone: res.phone});
        localStorage.setItem('loginData', JSON.stringify(this.loginData));
    }

    register(data) {
        return this.http.post<any>(this.API_URL + 'api/oauth/register', data).pipe(map(user => {
            console.log(user);
            // registration successful if there's a jwt token in the response
            if (user && user.token) {
                this.timerLoader.presentAutoTimerLoading();
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.nativeStorage.setItem('token', user.token)
                    .then(() => {
                        this.isLoggedIn = true;
                        this.updateLocalStorage(user);
                        this.token = user.token;
                        window.dispatchEvent(new CustomEvent('refreshEvent'));
                    }, error => {
                        alert('native storegae not working -' + JSON.stringify(error));
                    });
            }

            return user;
        }));
    }

    updateAccount(phone: string, name: string, email: string) {
        return this.http.post<any>(this.API_URL + 'api/oauth/update', {phone, name, email}).pipe(map(user => {
            //  alert(JSON.stringify(user));
            // login successful if there's a jwt token in the response
            if (user && user.token) {
                this.timerLoader.presentAutoTimerLoading();
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.updateLocalStorage(user);
            }

            return user;
        }));
    }

    loginWithFacebook() {
        this.fb.login(['public_profile', 'email'])
            .then(res => {
                if (res.status === 'connected') {
                    this.isLoggedIn = true;
                    this.getFBUserDetail(res.authResponse.userID);
                    if (res && res.authResponse.accessToken) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        this.nativeStorage.setItem('token', res.authResponse.accessToken)
                            .then(() => {
                                this.timerLoader.presentAutoTimerLoading();
                                this.token = res.authResponse.accessToken;
                                this.toastService.presentAlertToast('Logged in successfully!');
                                window.dispatchEvent(new CustomEvent('refreshEvent'));
                                this.route.navigate(['/tabs/home']);
                            }, error => {
                                alert(JSON.stringify(error));
                            });
                    }
                } else {
                    this.isLoggedIn = false;
                }
            })
            .catch(e => console.log('Error logging into Facebook', e));
    }

    getFBUserDetail(userid: any) {
        this.fb.api('/' + userid + '/?fields=id,email,name,picture.width(720).height(720).as(picture_large)', ['public_profile'])
            .then(res => {
                console.log('fb data - ', res);
                this.users = res;
                this.users.phone = '';
                this.users.picture = JSON.stringify(res.picture_large.data);
                console.log(this.users);
                this.socialRegister(this.users);
            })
            .catch(e => {
                console.log(e);
            });
    }

    fblogout() {
        this.fb.logout()
            .then(res => this.isLoggedIn = false)
            .catch(e => console.log('Error logout from Facebook', e));
    }

    updateLocalStorage(users) {
        this.http.get<any>(this.API_URL + 'api/users/' + users.email).subscribe((res: (any)) => {
            console.log(res);
            this.nativeStorage.setItem('currentUser', res)
                .then(() => {
                    this.modelCtr.dismiss();
                }, error => {
                    alert(JSON.stringify(error));
                });
        }, (error) => {
            alert(JSON.stringify(error));
        });
    }

    getToken() {
        return this.nativeStorage.getItem('token').then(
            data => {
                this.token = data;
                if (this.token != null) {
                    this.isLoggedIn = true;
                } else {
                    this.isLoggedIn = false;
                }
            },
            error => {
                this.token = null;
                this.isLoggedIn = false;
            }
        );
    }

    socialRegister(data) {
        console.log('before reg', data);
        return this.http.post<any>(this.API_URL + 'api/oauth/social-register', data).subscribe((res) => {
            console.log('after ', res);
            this.updateLocalStorage(data);
        }, (er) => {
            this.updateLocalStorage(data);
        });
    }

    updateImage(data) {
        return this.http.post<any>(this.API_URL + 'api/oauth/updateImage', data);
    }
}
