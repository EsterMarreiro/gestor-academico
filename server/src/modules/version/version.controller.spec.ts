import { Test, TestingModule } from '@nestjs/testing';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';

describe('VersionController', () => {
  let controller: VersionController;
  const versionServiceMock = {
    getVersion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersionController],
      providers: [
        {
          provide: VersionService,
          useValue: versionServiceMock,
        },
      ],
    }).compile();

    controller = module.get<VersionController>(VersionController);
    versionServiceMock.getVersion.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the payload from VersionService', () => {
    const payload = {
      version: '0.1.0',
      environment: 'development',
      buildDate: '2026-01-01T00:00:00.000Z',
    };
    versionServiceMock.getVersion.mockReturnValue(payload);

    expect(controller.getVersion()).toEqual(payload);
    expect(versionServiceMock.getVersion).toHaveBeenCalledTimes(1);
  });
});
