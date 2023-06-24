import {
  BadRequestException,
  HttpException,
  INestApplication,
  VERSION_NEUTRAL,
  Version,
  VersioningType,
} from '@nestjs/common';
import { Request } from 'express';

import {
  MINIMUM_SUPPORT_API_VERSION,
  SUPPORTING_VERSIONS,
} from './supporting-versions';

const HEADER_VERSIONING = 'x-version-id';
const SERMANTIC_VERSION_REXGEX =
  /^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/;

/**
 * This method is called by NestJS to extract the version from the request header
 * whenever a request reaches a controller with a @Version() decorator.
 * @param request
 * @returns
 */
const headerExtractor = (request: Request): string | string[] => {
  const requestVersions = request.headers[HEADER_VERSIONING] ?? '';

  const extractedVersions = [requestVersions]
    .flatMap((v) => {
      return Array.isArray(v) ? v : v.split(',');
    })
    .filter((v) => !!v)
    .map((versionFromRequest) => {
      if (SERMANTIC_VERSION_REXGEX.test(versionFromRequest)) {
        const [major, minor] = versionFromRequest.split('.');

        return `${major}.${minor}`;
      } else {
        throw new BadRequestException({
          code: 'INVALID_VERSION',
          message: `Wrong sermantic version: ${versionFromRequest}`,
        });
      }
    });
  // Express does not support checking version by ordering like Fastify
  // https://docs.nestjs.com/techniques/versioning#custom-versioning-type
  // .sort().reverse();

  if (extractedVersions.length === 1) {
    const [major, minor] = extractedVersions[0].split('.');
    const [minimumMajor, minimumMinor] = MINIMUM_SUPPORT_API_VERSION.split('.');
    if (
      Number(major) < Number(minimumMajor) ||
      (Number(major) === Number(minimumMajor) &&
        Number(minor) < Number(minimumMinor))
    ) {
      throw new HttpException(
        {
          code: 'UNSUPPORTED_VERSION',
          message: `Unsupported version: '${extractedVersions[0]}'. Minimum supported version currently is '${MINIMUM_SUPPORT_API_VERSION}'`,
        },
        426, // Upgrade Required
      );
    }
  }

  return extractedVersions;
};

export const enableApiVersioning = (application: INestApplication) => {
  application.enableVersioning({
    type: VersioningType.CUSTOM,
    defaultVersion: VERSION_NEUTRAL,
    extractor: headerExtractor,
  });
};

/**
 * This decorator is used to decorate the api endpoints
 * which can serve the multiple request versions include [inputVersion...aboveVersions]
 * @publicApi
 */
export const MinimumVersion = (inputversion: string): MethodDecorator => {
  const index = SUPPORTING_VERSIONS.findIndex((v) => v === inputversion);
  const newVersions = [
    inputversion,
    ...SUPPORTING_VERSIONS.slice(index, SUPPORTING_VERSIONS.length),
  ];

  return Version(newVersions);
};
