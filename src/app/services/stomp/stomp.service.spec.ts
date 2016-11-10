/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { STOMPService } from './stomp.service';

describe('Service: Stomp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [STOMPService]
    });
  });

  it('should ...', inject([STOMPService], (service: STOMPService) => {
    expect(service).toBeTruthy();
  }));
});
