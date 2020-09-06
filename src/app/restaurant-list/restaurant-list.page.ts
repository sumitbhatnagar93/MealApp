import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import {AuthService} from '../auth/auth.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {File, FileEntry} from '@ionic-native/file/ngx';

declare var google;

@Component({
    selector: 'app-restaurant-list',
    templateUrl: './restaurant-list.page.html',
    styleUrls: ['./restaurant-list.page.scss'],
})
export class RestaurantListPage implements OnInit, AfterViewInit {
    options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    constructor(private file: File, private uploadService: AuthService, private camera: Camera) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
    }

    readFile(file: any) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            const formData = new FormData();
            formData.append('old_picture', 'data.old_picture');
            formData.append('email', 'sumitsaxena201@gmail.com');
            formData.append('picture', imgBlob, file.name);
            console.log('picture', imgBlob, file.name);
            this.uploadService.updateImage(formData);
        };
        reader.readAsArrayBuffer(file);
    }

    takePicture() {
        this.camera.getPicture(this.options).then((imageData) => {
            this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {
                entry.file(file => {
                    console.log(file);
                    this.readFile(file);
                });
            });
        }, (err) => {
            // Handle error
        });
    }
}
