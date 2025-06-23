import { Test, TestingModule } from '@nestjs/testing';
import { RequestProductService } from './request-product.service';

describe('RequestProductService', () => {
  let service: RequestProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestProductService],
    }).compile();

    service = module.get<RequestProductService>(RequestProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
