import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const APP_VERSION = 'APP_VERSION';
export const BUILD_DATE = 'BUILD_DATE';

type PackageMetadata = {
  version?: string;
};

export function ensureAppVersion(metadata: PackageMetadata): string {
  if (!metadata.version?.trim()) {
    throw new Error('Version field not found in server/package.json');
  }

  return metadata.version;
}

export function resolveAppVersion(): string {
  const packageJsonPath = join(__dirname, '../../../package.json');
  const packageJson = readFileSync(packageJsonPath, 'utf-8');
  const metadata = JSON.parse(packageJson) as PackageMetadata;

  return ensureAppVersion(metadata);
}
