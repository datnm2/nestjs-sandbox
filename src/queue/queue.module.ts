import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';


import { QueueNames } from './constants';
import { QueueHelper } from './helper';
import { QueueService } from './queue.service';
import { Queue1Processor } from './queue1-processor';
import { QueueCronProcessor } from './queue-cron-processor';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async () => {
        const tls = process.env.REDIS_CACHE_TLS === 'true'
          ? {
              tls: {
                host: process.env.REDIS_CACHE_HOST,
                port: parseInt(process.env.REDIS_CACHE_PORT, 10),
              },
            }
          : {};
        return {
          redis: {
            host: process.env.REDIS_CACHE_HOST,
            port: parseInt(process.env.REDIS_CACHE_PORT, 10),
            password: process.env.REDIS_CACHE_PASSWORD,
            ...tls,
          },
        };
      },
      inject: [],
    }),
    BullModule.registerQueue({
      name: QueueHelper.getQueueName(QueueNames.QUEUE1),
      limiter: {
        max: 3,
        duration: 3000,
        bounceBack: false,
      },
      defaultJobOptions: {
        attempts: 5,
      },
    }),
    BullModule.registerQueue({
      name: QueueHelper.getQueueName(QueueNames.QUEUE2),
      limiter: {
        max: 3,
        duration: 10000,
        bounceBack: false,
      },
      defaultJobOptions: {
        attempts: 20,
        backoff: 1 * 60 * 60 * 1000, // retry after 1 hour
        removeOnFail: false,
        removeOnComplete: true,
      },
    }),
    BullModule.registerQueue({
      name: QueueHelper.getQueueName(QueueNames.CRONQUEUE),
      limiter: {
        max: 3,
        duration: 10000,
        bounceBack: false,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: 1 * 60 * 1000, // retry after 1 minute
        removeOnFail: false,
        removeOnComplete: true,
      },
    }),
  ],
  providers: [QueueService, Queue1Processor, QueueCronProcessor],
  exports: [QueueService],
})
export class QueueModule {}
