import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StrictModalComponent } from './strict-modal.component';

describe('StrictModalComponent', () => {
  let component: StrictModalComponent;
  let fixture: ComponentFixture<StrictModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrictModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StrictModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
