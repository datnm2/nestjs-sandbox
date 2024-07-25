import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PERMISSION_KEY } from '@beincom/constants';
import { VersioningType } from '@nestjs/common';
import { HEADER_VERSIONING } from './auth.middleware';
import { AppService } from './app.service';
import { sleep } from './ulti';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const testString = JSON.stringify({ PERMISSION_KEY });
  console.log(testString);
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: HEADER_VERSIONING,
  });

  // Starts listening for shutdown hooks
  app.enableShutdownHooks(['SIGINT']);
  await app.listen(6789);

  // while (true) {
  //   const activeHandles = process.getMaxListeners();
  //   const activeRequests = process._getActiveRequests();

  //   console.log('Active Handles:', activeHandles);
  //   console.log('Active Requests:', activeRequests);

  //   // If there are no active handles or requests, the event loop will be empty and Node.js can exit.
  //   if (activeHandles.length === 0 && activeRequests.length === 0) {
  //     console.log('Event loop is empty!');
  //   }
  // }

  const appService = await app.resolve(AppService);
  const test = await appService.emitEvent();

  let i = 0;

  // Note: Timeout is used for illustration of
  // delayed termination purposes only.
  console.log('process.pid', process.pid);
  // setTimeout(() => {
  //   console.log('Exiting process');
  //   process.kill(process.pid, 'SIGTERM');
  // }, 5000);

  // while (true) {
  //   await sleep(1000);
  //   i++;
  //   console.log(`app is running after ${i} seconds`);
  // }
}
bootstrap();
