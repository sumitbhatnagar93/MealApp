import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
    selector: 'app-verification',
    templateUrl: './verification.page.html',
    styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {

    bgImage = './assets/images/bgblack.png';
    localData = [];

    constructor(private http: AuthService) {
    }

    ngOnInit() {
        this.localData = JSON.parse(localStorage.getItem('loginData'));
    }

    onSubmit(data) {
        // console.log(data.value.otp, this.localData[0].otp);
        // if (data.value.otp === this.localData[0].otp) {
        //     console.log('valid OTP');
        //     return;
        // }
        // console.log('Invalid OTP');
    }

    otpController(event, next, prev) {
        if (event.target.value.length < 1 && prev) {
            prev.setFocus();
        } else if (next && event.target.value.length > 0) {
            next.setFocus();
        } else {
            return 0;
        }
    }

    resendOTP() {
        const data = new FormData();
        data.append('phone', this.localData[0].phone);
        this.http.sendOTP(data).subscribe((res) => {
            this.http.updateLoginData(res);
        }, (error) => {
            console.log(error);
        });
    }
}
