import { TestBed } from '@angular/core/testing';

import { VmModelService } from './vm-model.service';

describe('VmModelService', () => {
  let service: VmModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VmModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
