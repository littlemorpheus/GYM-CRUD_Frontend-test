import { TestBed } from '@angular/core/testing';

import { ItemRetrievalService } from './item-retrieval.service';

describe('ItemRetrievalService', () => {
  let service: ItemRetrievalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemRetrievalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
