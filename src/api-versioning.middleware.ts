import {
  MINIMUM_SUPPORT_API_VERSION,
  SUPPORTING_VERSIONS,
} from './api-versioning/supporting-versions';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
export const HEADER_VERSIONING = 'x-version-id';
const SERMANTIC_VERSION_REXGEX =
  /^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/;

@Injectable()
export class ApiVersioningMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...ApiVersioningMiddleware');
    const versionFromRequest = req.headers[HEADER_VERSIONING] as string;
    if (versionFromRequest) {
      if (SERMANTIC_VERSION_REXGEX.test(versionFromRequest)) {
        const [majorVersion, minorVersion] = versionFromRequest.split('.');
        this.validateMinimumSupportVersion(majorVersion, minorVersion);

        const shortenedVersion = `${majorVersion}.${minorVersion}`;
        this.validateSupportingVersions(shortenedVersion);

        req.headers[HEADER_VERSIONING] = shortenedVersion; //override the header for leaned version
      } else {
        throw new BadRequestException({
          code: 'INVALID_VERSION',
          message: `Wrong sermantic version format: '${versionFromRequest}'.`,
        });
      }
    }

    next();
  }

  private validateMinimumSupportVersion(
    majorVersion: string,
    minorVersion: string,
  ) {
    const [minimumMajor, minimumMinor] = MINIMUM_SUPPORT_API_VERSION.split('.');
    if (
      Number(majorVersion) < Number(minimumMajor) ||
      (Number(majorVersion) === Number(minimumMajor) &&
        Number(minorVersion) < Number(minimumMinor))
    ) {
      throw new HttpException(
        {
          code: 'UNSUPPORTED_VERSION',
          message: `Unsupported version. Minimum supported version currently is '${MINIMUM_SUPPORT_API_VERSION}'`,
        },
        426, // Upgrade Required
      );
    }
  }

  private validateSupportingVersions(shortenedRequestVersion: string) {
    if (!SUPPORTING_VERSIONS.includes(shortenedRequestVersion)) {
      throw new BadRequestException({
        code: 'UNSUPPORTED_VERSION',
        message: `Supporting versions: ${SUPPORTING_VERSIONS.map((x) =>
          x.concat('.x'),
        ).join(', ')}`,
      });
    }
  }
}
