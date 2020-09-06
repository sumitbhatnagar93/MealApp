import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TiffinServicesPage } from './tiffin-services.page';

describe('TiffinServicesPage', () => {
  let component: TiffinServicesPage;
  let fixture: ComponentFixture<TiffinServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiffinServicesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TiffinServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
