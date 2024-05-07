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

  while (true) {
    const activeHandles = process.getMaxListeners();
    const activeRequests = process._getActiveRequests();

    console.log('Active Handles:', activeHandles);
    console.log('Active Requests:', activeRequests);

    // If there are no active handles or requests, the event loop will be empty and Node.js can exit.
    if (activeHandles.length === 0 && activeRequests.length === 0) {
      console.log('Event loop is empty!');
    }
  }
}
bootstrap();
