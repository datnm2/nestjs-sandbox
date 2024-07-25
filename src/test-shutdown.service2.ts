import { BeforeApplicationShutdown, Injectable, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { sleep } from './ulti';


@Injectable()
export class TestShutDownService2 implements OnModuleInit, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown  {
  constructor(){
    let i = 1;
    setTimeout(async () => {
      this.running();
    }, 1000);
  }

  onModuleInit() {
    console.log(`TestShutDownService2: has been initialized.`);
  }

  async running(){
    let i = 0;
    while (true) {
      await sleep(500);
      i+=1;
      console.log(`TestShutDownService2 is running after ${i} seconds`);
    }
  }

  async onModuleDestroy() {
    console.log(`TestShutDownService2: onModuleDestroy`);
  }

  async beforeApplicationShutdown(signal?: string) {
    console.log(`TestShutDownService2: beforeApplicationShutdown  ${signal}`);
    
    let i = 0;
    while (i  < 5) {
      await sleep(1000);
      i++;
      console.log(`beforeApplicationShutdown2 is running after ${i} seconds`);
    }
  }

  async onApplicationShutdown(signal?: string) {
    console.log(`TestShutDownService2: onApplicationShutdown ${signal}`);
    
    let i = 0;
    // while (true) {
    //   await sleep(1000);
    //   i++;
    //   console.log(`onApplicationShutdown is running after ${i} seconds`);
    // }
  }
}

