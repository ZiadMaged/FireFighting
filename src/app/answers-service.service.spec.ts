import { TestBed } from '@angular/core/testing';

import { AnswersServiceService } from './answers-service.service';

describe('AnswersServiceService', () => {
  let service: AnswersServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnswersServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
