import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {ConfirmPasswordValidator} from './confirm-password.validator';
import {ModalController} from '@ionic/angular';
import {AlertService} from '../../alert-services/alert.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    logo = './assets/images/shade-logo.png';
    registerFrom: FormGroup;
    mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
    msg = '';
    isPhoneInvalid: boolean;
    isEmailInvalid: boolean;

    constructor(private http: AuthService, private route: Router, private formBuilder: FormBuilder,
                public modelCtr: ModalController,
                public toastService: AlertService) {
        this.isPhoneInvalid = false;
        this.isEmailInvalid = false;
        this.registerFrom = this.formBuilder.group({
            phone: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
            email: [null, [Validators.required, Validators.email]],
            password: ['', Validators.required],
            cPassword: ['', Validators.required]
        }, {
            validator: ConfirmPasswordValidator('password', 'cPassword')
        });
    }

    ngOnInit() {
        this.modelCtr.dismiss();
    }

    get f() {
        return this.registerFrom.controls;
    }

    onSubmit(value) {
        const formData = new FormData();
        formData.append('phone', value.phone);
        formData.append('email', value.email);
        formData.append('password', value.password);
        formData.append('password_confirmation', value.cPassword);
        this.http.register(formData).subscribe((res) => {
            console.log(res);
            this.registerFrom.reset();
            this.msg = 'Registration successful!';
            this.toastService.presentAlertToast(this.msg);
            window.dispatchEvent(new CustomEvent('refreshEvent'));
            this.route.navigate(['tabs/home']);
        }, (error) => {
            console.log(error.error[0]);
            if (typeof error.error[0].phone !== 'undefined') {
                this.msg = error.error[0].phone;
                this.isPhoneInvalid = true;
            } else {
                this.isPhoneInvalid = false;
            }
            if (typeof error.error[0].email !== 'undefined') {
                this.msg = error.error[0].email;
                this.isEmailInvalid = true;
            } else {
                this.isEmailInvalid = false;
            }
            this.toastService.presentAlertToast(this.msg);
        });
    }

    login() {
        this.http.loginWithFacebook();
    }

    googleSignIn() {
        this.http.googleSignIn();
    }

}
