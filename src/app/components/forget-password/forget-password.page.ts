import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.page.html',
    styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
    forgetForm: FormGroup;

    constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private route: Router) {
        this.forgetForm = this.formBuilder.group({
            phone: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
        });
    }

    ngOnInit() {
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    onSubmit(value) {
        console.log('ok');
        this.dismiss();
        this.route.navigate(['/verification']);
    }

}
