import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VersionResponseDto } from './dto/version-response.dto';
import { APP_VERSION, BUILD_DATE } from './version.constants';

@Injectable()
export class VersionService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(APP_VERSION) private readonly appVersion: string,
    @Inject(BUILD_DATE) private readonly buildDate: string,
  ) {}

  getVersion(): VersionResponseDto {
    return {
      version: this.appVersion,
      environment: this.configService.get<string>('NODE_ENV') ?? 'development',
      buildDate: this.buildDate,
    };
  }
}
