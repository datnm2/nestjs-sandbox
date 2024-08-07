import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
config();
import { AppModule } from './app.module';
import { PERMISSION_KEY } from '@beincom/constants';
import { VersioningType } from '@nestjs/common';
import { HEADER_VERSIONING } from './auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const testString = JSON.stringify({ PERMISSION_KEY });
  // console.log(testString);
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: HEADER_VERSIONING,
  });

  const port = process.env.PORT || 6789;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
  // while (true) {
  //   const activeHandles = process.getMaxListeners();
  //   // const activeRequests = process._getActiveRequests();

  //   console.log('Active Handles:', activeHandles);
  //   // console.log('Active Requests:', activeRequests);

  //   // If there are no active handles or requests, the event loop will be empty and Node.js can exit.
  //   if (activeHandles === 0 ) {
  //     console.log('Event loop is empty!');
  //   }
  // }
}
bootstrap();
