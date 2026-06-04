import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { VersionController } from '../src/modules/version/version.controller';
import { VersionModule } from '../src/modules/version/version.module';

describe('Version endpoint (e2e)', () => {
  let app: INestApplication;
  let versionController: VersionController;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.BUILD_DATE = '2026-01-01T00:00:00.000Z';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
        }),
        VersionModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    versionController = app.get(VersionController);
  });

  afterAll(async () => {
    delete process.env.BUILD_DATE;
    await app.close();
  });

  it('GET /api/v1/version', () => {
    expect(versionController.getVersion()).toMatchObject({
      version: '0.1.0',
      environment: 'test',
      buildDate: '2026-01-01T00:00:00.000Z',
    });
  });
});
