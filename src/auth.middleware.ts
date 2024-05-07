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
export class AuthMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {

    next();
  }
}
