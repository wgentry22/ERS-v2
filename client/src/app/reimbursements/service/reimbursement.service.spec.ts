import { TestBed } from '@angular/core/testing';

import { ReimbursementService } from './reimbursement.service';

describe('ReimbursementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReimbursementService = TestBed.get(ReimbursementService);
    expect(service).toBeTruthy();
  });
});
