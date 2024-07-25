import { BeforeApplicationShutdown, Inject, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from 'src/app.service';
import { sleep } from 'src/ulti';


export class GroupListener implements OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown    {
  constructor(
  ) {
    console.log('GroupListener constructor');
  }

  @OnEvent('order.created')
  async handleOrderCreatedEvent(payload: OrderCreatedEvent) {
    console.log('handleOrderCreatedEvent', payload);

    setTimeout(() => {
      console.log('handleOrderCreatedEvent inside setTimeout 10000');
    }, 10000);


    let i = 0;
    while (true) {
      await sleep(1000);
      i++;
      console.log(`listener is running after ${i} seconds`);
    }
  }

    async onModuleDestroy() {
      console.log(`GroupListener: onModuleDestroy`);
      let i = 0;
    }
    async beforeApplicationShutdown(signal?: string) {
      console.log(`GroupListener: beforeApplicationShutdown  ${signal}`);
      
      let i = 0;
      // while (true) {
      //   await sleep(1000);
      //   i++;
      //   console.log(`beforeApplicationShutdown is running after ${i} seconds`);
      // }
    }

    async onApplicationShutdown(signal?: string) {
      console.log(`GroupListener: onApplicationShutdown ${signal}`);
      
    }

}
