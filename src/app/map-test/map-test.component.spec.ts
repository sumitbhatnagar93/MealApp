import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapTestComponent } from './map-test.component';

describe('MapTestComponent', () => {
  let component: MapTestComponent;
  let fixture: ComponentFixture<MapTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
