import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {ForgetPasswordPage} from '../../components/forget-password/forget-password.page';
import {AlertService} from '../../alert-services/alert.service';
import {LoaderService} from '../../services/loader.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    bgImage = './assets/images/bgblack.png';
    logo = './assets/images/shade-logo.png';
    loginFrom: FormGroup;
    mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
    isPasswordInvalid: boolean;
    isPhoneInvalid: boolean;
    isProcess: boolean;
    res: any;
    msg = '';

    constructor(
        private http: AuthService,
        private route: Router,
        private formBuilder: FormBuilder,
        public modelCtr: ModalController,
        public toastService: AlertService,
    ) {
        this.isPasswordInvalid = false;
        this.isPhoneInvalid = false;
        this.isProcess = false;
        this.loginFrom = this.formBuilder.group({
            phone: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
            password: ['', Validators.required],
        });
    }

    ngOnInit() {
    }

    public async dismiss() {
        const modal = await this.modelCtr.getTop();
        modal.dismiss();
    }

    get f() {
        return this.loginFrom.controls;
    }


    onSubmit(value) {
        this.isProcess = true;
        this.http.login(this.f.phone.value, this.f.password.value).subscribe((res: (any)) => {
            this.isPasswordInvalid = false;
            this.isPhoneInvalid = false;
            this.isProcess = false;
            console.log(res);
            this.res = JSON.stringify(res);
            this.loginFrom.reset();
            this.dismiss();
            this.toastService.presentAlertToast('Logged in successfully!');
            //this.route.navigate(['/tabs/home']);
        }, (error) => {
            this.isProcess = false;
            this.res = JSON.stringify(error);
            if (error.status === 401) {
                if (error.error.errorType === 'phone') {
                    this.isPhoneInvalid = true;
                    this.isPasswordInvalid = true;
                    this.msg = 'Invalid phone number!';
                } else {
                    this.msg = 'Invalid phone number or password!';
                    this.isPhoneInvalid = false;
                    this.isPasswordInvalid = true;
                }
                console.log(error.status);
            }
            this.toastService.presentAlertToast(this.msg);
        });
    }

    async forgetPasswordModal() {
        this.modelCtr.dismiss();
        const modal = await this.modelCtr.create({
            component: ForgetPasswordPage,
            cssClass: 'half-modal',
        });
        return await modal.present();
    }

    login() {
        this.http.loginWithFacebook();
    }

    googleSignIn() {
        this.http.googleSignIn();
    }

    logout() {
        this.http.fblogout();
    }

}
