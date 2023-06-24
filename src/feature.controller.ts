import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { VERSION_1_1 } from './api-versioning/supporting-versions';

@Controller('feature')
export class FeatureController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Version(VERSION_1_1)
  getHello1_1(): string {
    return 'v1.1';
  }

  @Get()
  @Version('1.0')
  getHello1(): string {
    return 'v1.0';
  }

  @Get()
  getHello(): string {
    return 'v0.0';
  }
  @Get('cats')
  @Version(VERSION_1_1)
  getCats11(): string {
    return 'cat v1.1';
  }
  @Get('cats')
  @Version('1.0')
  getCats1(): string {
    return 'cat v1.0';
  }
  @Get('cats')
  getCats(): string {
    return 'cat v0.0';
  }
}
