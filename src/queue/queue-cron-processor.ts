import { OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { JobNames, QueueNames } from './constants';
import { Sequelize } from 'sequelize';
import { Job } from 'bull';
import { QueueHelper } from './helper';
import { TestJobDto } from './interfaces';

@Processor(QueueHelper.getQueueName(QueueNames.CRONQUEUE))
export class QueueCronProcessor {
  private readonly logger = new Logger(QueueCronProcessor.name);

  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize
  ) {}

  @Process(JobNames.TEST_JOB)
  public async handleTestJob(job: Job<TestJobDto>) {
    const { test } = job.data;
    this.logger.log({
      msg: `[Queue Job] processing job: ${job.id}, test: ${test}`,
    });

    if(test === 'error') {
      throw new Error('test error');
    }
  }



  @OnQueueFailed()
  public onFail(job: Job<any>, err: Error) {
    if (job.attemptsMade === job.opts.attempts) {
      this.logger.error({
        err,
        job: {
          id: job.id,
          name: job.name,
          data: JSON.stringify(job.data),
        },
        msg: `[Queue Job] error message: ${err.message}`,
      });
    }
  }

  @OnQueueCompleted()
  public onSuccess(job: Job<TestJobDto>) {
    this.logger.log({
      job: {
        id: job.id,
        name: job.name,
        data: JSON.stringify(job.data),
      },
      msg: `[Queue Job]: successfully`,
    });
  }
}
