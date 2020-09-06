import { TestBed } from '@angular/core/testing';

import { CookreyVendorService } from './cookrey-vendor.service';

describe('CookreyVendorService', () => {
  let service: CookreyVendorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookreyVendorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
