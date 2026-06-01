import { ensureAppVersion, resolveAppVersion } from './version.constants';

describe('version.constants', () => {
  it('should read the version from server/package.json', () => {
    expect(resolveAppVersion()).toBe('0.1.0');
  });

  it('should throw when version is missing from package metadata', () => {
    expect(() => ensureAppVersion({})).toThrow(
      'Version field not found in server/package.json',
    );
  });
});
