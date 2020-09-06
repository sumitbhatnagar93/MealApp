import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-block-temp',
    styles: [`
        :host {
            text-align: center;
            color: #d26619;
        }

        .block-ui-template {
            margin: 0 auto;
            margin-top: 70%;
        }

        .block-ui-template img {
            width: 100%;
        }
    `],
    template: `
        <div class="block-ui-template">
            <ion-spinner name="bubbles"></ion-spinner>
        </div>
    `
})
export class BlockTemplateComponent implements OnInit {
    message: any;

    ngOnInit(): void {
    }
}
