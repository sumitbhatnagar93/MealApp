import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorSinglePage } from './vendor-single.page';

describe('VendorSinglePage', () => {
  let component: VendorSinglePage;
  let fixture: ComponentFixture<VendorSinglePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorSinglePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorSinglePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
