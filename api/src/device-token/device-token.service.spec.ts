import { Test, TestingModule } from '@nestjs/testing';
import { DeviceTokenService } from './device-token.service';

describe('DeviceTokenService', () => {
  let service: DeviceTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceTokenService],
    }).compile();

    service = module.get<DeviceTokenService>(DeviceTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
