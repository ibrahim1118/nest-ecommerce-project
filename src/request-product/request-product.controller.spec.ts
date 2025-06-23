import { Test, TestingModule } from '@nestjs/testing';
import { RequestProductController } from './request-product.controller';
import { RequestProductService } from './request-product.service';

describe('RequestProductController', () => {
  let controller: RequestProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestProductController],
      providers: [RequestProductService],
    }).compile();

    controller = module.get<RequestProductController>(RequestProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
