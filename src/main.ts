import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PERMISSION_KEY } from '@beincom/constants';
import { VersioningType } from '@nestjs/common';
import { HEADER_VERSIONING } from './auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const testString = JSON.stringify({ PERMISSION_KEY });
  console.log(testString);
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: HEADER_VERSIONING,
  });
  await app.listen(6789);
}
bootstrap();
