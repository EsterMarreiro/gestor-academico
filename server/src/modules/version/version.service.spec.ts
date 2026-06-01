import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { APP_VERSION, BUILD_DATE } from './version.constants';
import { VersionService } from './version.service';

describe('VersionService', () => {
  let service: VersionService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VersionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) =>
              key === 'NODE_ENV' ? 'test' : undefined,
            ),
          },
        },
        {
          provide: APP_VERSION,
          useValue: '0.1.0',
        },
        {
          provide: BUILD_DATE,
          useValue: '2026-01-01T00:00:00.000Z',
        },
      ],
    }).compile();

    service = module.get<VersionService>(VersionService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return version metadata', () => {
    expect(service.getVersion()).toEqual({
      version: '0.1.0',
      environment: 'test',
      buildDate: '2026-01-01T00:00:00.000Z',
    });
  });

  it('should fallback to development when NODE_ENV is unavailable', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);

    expect(service.getVersion().environment).toBe('development');
  });
});
