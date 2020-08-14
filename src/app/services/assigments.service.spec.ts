import { TestBed } from '@angular/core/testing';

import { AssigmentsService } from './assigments.service';

describe('AssigmentsService', () => {
  let service: AssigmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssigmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
