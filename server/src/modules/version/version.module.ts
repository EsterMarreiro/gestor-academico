import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';
import {
  APP_VERSION,
  BUILD_DATE,
  resolveAppVersion,
} from './version.constants';

@Module({
  imports: [ConfigModule],
  controllers: [VersionController],
  providers: [
    VersionService,
    {
      provide: APP_VERSION,
      useFactory: resolveAppVersion,
    },
    {
      provide: BUILD_DATE,
      useFactory: () => process.env.BUILD_DATE ?? new Date().toISOString(),
    },
  ],
})
export class VersionModule {}
