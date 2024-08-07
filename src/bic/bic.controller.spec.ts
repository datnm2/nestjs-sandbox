import { Test, TestingModule } from '@nestjs/testing';
import { BicController } from './bic.controller';

describe('BicController', () => {
  let controller: BicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BicController],
    }).compile();

    controller = module.get<BicController>(BicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
