import { Test, TestingModule } from '@nestjs/testing';
import { DeviceTokenController } from './device-token.controller';

describe('DeviceTokenController', () => {
  let controller: DeviceTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceTokenController],
    }).compile();

    controller = module.get<DeviceTokenController>(DeviceTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
