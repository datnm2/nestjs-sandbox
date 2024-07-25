import { BeforeApplicationShutdown, Injectable, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { sleep } from './ulti';


@Injectable()
export class TestShutDownService implements OnModuleInit, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown  {
  onModuleInit() {
    console.log(`TestShutDownService: has been initialized.`);
  }
  async onModuleDestroy() {
    console.log(`TestShutDownService: onModuleDestroy`);
    let i = 0;
    while (i < 10) {
      await sleep(1000);
      i++;
      console.log(`onModuleDestroy is running after ${i} seconds`);
    }
  }
  async beforeApplicationShutdown(signal?: string) {
    console.log(`TestShutDownService: beforeApplicationShutdown  ${signal}`);
    
    let i = 0;
    // while (true) {
    //   await sleep(1000);
    //   i++;
    //   console.log(`beforeApplicationShutdown is running after ${i} seconds`);
    // }

  }
  async onApplicationShutdown(signal?: string) {
    console.log(`TestShutDownService: onApplicationShutdown ${signal}`);
    
    let i = 0;
    // while (true) {
    //   await sleep(1000);
    //   i++;
    //   console.log(`onApplicationShutdown is running after ${i} seconds`);
    // }
  }
}

