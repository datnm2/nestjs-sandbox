import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { sleep } from './ulti';

export class OrderCreatedEvent {
  constructor(public readonly data: { orderId: number; payload: any }) {}

  get orderId() {
    return this.data.orderId;
  }

  get payload() {
    return this.data.payload;
  }
}
  
@Injectable()
export class AppService {
  constructor(private eventEmitter: EventEmitter2) {}
  getHello(): string {
    return 'Hello World!';
  }

  async emitEvent() {
    console.log('emitEvent');
    this.eventEmitter.emit(
      'order.created',
      new OrderCreatedEvent({
        orderId: 1,
        payload: {},
      }),
    );

    
  }    
}
