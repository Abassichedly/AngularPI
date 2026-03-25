import { TestBed } from '@angular/core/testing';

import { PredictiveService } from './predictive.service';

describe('PredictiveService', () => {
  let service: PredictiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
