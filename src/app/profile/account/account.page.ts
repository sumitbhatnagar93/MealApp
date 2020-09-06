import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {UpdateUserPage} from '../../components/update-user/update-user.page';
import {LoginPage} from '../../auth/login/login.page';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {LoaderService} from '../../services/loader.service';
import {File, FileEntry} from '@ionic-native/file/ngx';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';

@Component({
    selector: 'app-account',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
    loggedIn: boolean;
    currentUser: any;
    picture: any;
    public finalImage: any;
    imgURL: any;
    public message: string;
    filePathLive = 'https://cookrey.com/images/profile/';
    filePathTest = 'http://laravel.test/images/profile/';

    constructor(
        private http: AuthService,
        public modalController: ModalController,
        private nativeStorage: NativeStorage,
        private timerLoader: LoaderService,
        private file: File,
        private camera: Camera,
        private actionSheetController: ActionSheetController,
    ) {
        this.loggedIn = false;
    }

    ngOnInit() {
        this.isLoggedIn();
        window.addEventListener('refreshEvent', () => {
            this.isLoggedIn();
        });
    }

    doRefresh(event) {
        console.log('Begin async operation');

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
            this.ngOnInit();
        }, 2000);
    }

    isLoggedIn() {
        this.nativeStorage.getItem('currentUser').then((res) => {
            console.log('second- ', res);
            if (res.picture) {
                if (res.picture.includes('https://')) {
                    this.picture = JSON.parse(res.picture).url;
                    this.finalImage = this.picture;
                } else {
                    this.picture = this.filePathLive + res.picture;
                    this.finalImage = res.picture;
                }
                console.log('third- ', this.picture);
            } else {
                this.picture = './assets/images/dummy-user.png';
                this.finalImage = '';
            }
            this.loggedIn = true;
            this.currentUser = res;
        }, (error) => {
        });
    }

    logout() {
        this.timerLoader.presentAutoTimerLoading();
        this.http.logout();
        this.loggedIn = false;
    }

    async updateInfoModal() {
        const modal = await this.modalController.create({
            component: UpdateUserPage,
            cssClass: 'half-modal',
            swipeToClose: true,
            componentProps: {
                'oldName': this.currentUser.name,
                'oldPhone': this.currentUser.phone,
                'email': this.currentUser.email,
            }
        });
        return await modal.present();
    }

    async presentLoginModal() {
        const modal = await this.modalController.create({
            component: LoginPage,
            cssClass: 'login-half-modal',
            swipeToClose: true,
        });
        modal.onDidDismiss().then((data) => {
            this.ngOnInit();
        });
        return await modal.present();
    }

    readFile(file: any) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            const formData = new FormData();
            formData.append('old_picture', this.finalImage);
            formData.append('email', this.currentUser.email);
            formData.append('picture', imgBlob, file.name);
            console.log('picture', imgBlob, file.name);
            this.http.updateImage(formData).subscribe((res: (any)) => {
                this.nativeStorage.setItem('currentUser', res)
                    .then(() => {
                        console.log('first- ', res);
                        this.ngOnInit();
                    }, error => {
                        console.log(JSON.stringify(error));
                    });
            }, (error) => {
                console.log(JSON.stringify(error));
            });
        };
        reader.readAsArrayBuffer(file);
    }

    async selectImage() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Select Image source',
            buttons: [{
                text: 'Load from Library',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.SAVEDPHOTOALBUM);
                }
            },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    takePicture(sourceType: PictureSourceType) {
        let options: CameraOptions = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then((imageData) => {
            this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {
                entry.file(file => {
                    console.log(file);
                    this.readFile(file);
                });
            });
        }, (err) => {
            console.log(err);
        });
    }
}
