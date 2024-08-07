import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { QueueNames } from './constants';
import { QueueHelper } from './helper';
import { Job } from './interfaces';

@Injectable()
export class QueueService {
  private queues: Record<string, Queue>;

  constructor(
    @InjectQueue(QueueHelper.getQueueName(QueueNames.QUEUE1))
    private readonly queue1: Queue,
    @InjectQueue(QueueHelper.getQueueName(QueueNames.QUEUE2))
    private readonly queue2: Queue,
    @InjectQueue(QueueHelper.getQueueName(QueueNames.CRONQUEUE))
    private readonly cronQueue: Queue
  ) {
    this.queues = {
      [QueueNames.QUEUE1]: queue1,
      [QueueNames.QUEUE2]: queue2,
    };
  }

  public async addBulkToQueue1<T>(jobs: Job<T>[]) {
    await this.queue1.addBulk(jobs);
  }

  public async addBulkToQueue2<T>(jobs: Job<T>[]) {
    await this.queue2.addBulk(jobs);
  }

  public async addJobToQueue<T>(queueName: QueueNames, job: Job<T>) {
    return this.queues[queueName].add(job.name, job.data, job.opts);
  }


  public async createCronJob<T>(job: Job<T>) {
      if (!job.opts.repeat?.['cron']) {
        throw new Error(`Missing cron job config: ${job.name}`);
      }

      await this.cronQueue.add(job.name, job.data, job.opts);
  }
}
