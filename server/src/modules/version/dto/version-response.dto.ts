import { ApiProperty } from '@nestjs/swagger';

export class VersionResponseDto {
  @ApiProperty({ example: '0.1.0' })
  version!: string;

  @ApiProperty({ example: 'development' })
  environment!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  buildDate!: string;
}
