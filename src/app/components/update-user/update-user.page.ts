import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-update-user',
    templateUrl: './update-user.page.html',
    styleUrls: ['./update-user.page.scss'],
})
export class UpdateUserPage implements OnInit {
    updateUserForm: FormGroup;
    // Data passed in by componentProps
    @Input() oldName: string;
    @Input() oldPhone: string;
    @Input() email: string;

    constructor(
        private modalCtrl: ModalController,
        private formBuilder: FormBuilder,
        private route: Router,
        private http: AuthService,
        public toastController: ToastController
    ) {
        this.updateUserForm = this.formBuilder.group({
            name: [null, Validators.required],
            phone: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
        });
    }

    ngOnInit() {
        console.log(this.oldPhone);
    }


    get f() {
        return this.updateUserForm.controls;
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    onSubmit(value) {
        this.http.updateAccount(this.f.phone.value, this.f.name.value, this.email).subscribe((res) => {
                this.presentAlertToast();
            },
            (error) => {
                alert(JSON.stringify(error));
            });
        window.dispatchEvent(new CustomEvent('refreshEvent'));
        this.dismiss();
    }

    async presentAlertToast() {
        const toast = await this.toastController.create({
            message: 'Information have been updated!',
            duration: 2000
        });
        toast.present();
    }
}
