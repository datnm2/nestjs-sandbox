import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { TestModel } from './database/models';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { ITestAttribute } from './database/models/test.model';
import { QueueService } from './queue/queue.service';
import { JobNames, QueueNames } from './queue/constants';
import { CronExpression } from '@nestjs/schedule';
import { get } from 'http';

@Controller()
export class AppController {
  private logger = new Logger(this.constructor.name);
  constructor(private readonly appService: AppService,
    private readonly queueService: QueueService,
    @InjectModel(TestModel)
    private readonly testModel: typeof TestModel
  ) { }

  @Get("create-cron-job")
  async createCronJon(): Promise<ITestAttribute[]> {
    // Usage Example
    const membersData = [
      { userId: 'd319c8e7-5cdb-4e7f-a8b7-d8f6492bcf0e', communityId: 'd319c8e7-5cdb-4e7f-a8b7-d8f6492bcf0e', increasePoint: 10 },
      { userId: 'd94f530e-4d7d-4c53-be0e-2372eac2fc32', communityId: 'd94f530e-4d7d-4c53-be0e-2372eac2fc32', increasePoint: 11 },
      { userId: '9a8b66f3-b8aa-4964-a153-9f624ae07289', communityId: 'd334bc67-7eef-42e6-b9d0-a6b1496323ea', increasePoint: 12 },
      { userId: 'd2b5a433-88e7-4823-b9c3-22c696889cbe', communityId: '9be94b15-f1ca-4a3b-be30-910f744ff941', increasePoint: 12 },
      // ... You can list as many members as you need to update or insert
    ];

    // Assume membersData is an array of objects containing memberId and the increment value for points
    const updateValues: ITestAttribute[] = membersData.map(data => ({
      userId: data.userId,
      communityId: data.communityId,
      // Assuming newPoints is the increment value for the points field for each user
      point: Sequelize.literal(`COALESCE(point, 0) + ${data.increasePoint}`) as unknown as number,
    }));

    // const results = await this.testModel.upsert(updateValues, {
    //   updateOnDuplicate: ['point'] // Specify the fields to update if a duplicate key is found
    // });
    // await this.queueService.addJobToQueue(QueueNames.QUEUE1, {
    //   name: JobNames.TEST_JOB,
    //   data: {
    //     test: 'error',
    //   },
    // });

    await this.queueService.createCronJob({
      name: JobNames.TEST_JOB,
      data: {
        test: 'success',
      },
      opts: {
        repeat: {
          cron: CronExpression.EVERY_30_SECONDS,
        },
        jobId: 'id0',
      },
    });

    await this.queueService.createCronJob({
      name: JobNames.TEST_JOB,
      data: {
        test: 'error',
      },
      opts: {
        repeat: {
          cron: CronExpression.EVERY_30_SECONDS,
        },
        jobId: 'id3',
      },
    });

    await this.queueService.createCronJob({
      name: JobNames.TEST_JOB,
      data: {
        test: 'success',
      },
      opts: {
        repeat: {
          cron: CronExpression.EVERY_30_SECONDS,
        },
        jobId: 'id1',
      },
    });

    return [];
  }

  @Get("test-heavy-task")
  async testHeavyTask(): Promise<string> {
    await this.heavyProcessTask(1000);

    console.log('Heavy task completed');
    return 'Heavy task completed';
  }

  @Get()
  async testFastTask(): Promise<string> {
    console.log('New request received');
    return 'OK';
  }

  async heavyProcessTask(processId: number): Promise<string> {
    let checkedNumbers = [];
    for (let i = 0; i < 10; i++) {
      // Simulate a heavy computational task
      const num = Math.floor(Math.random() * 1000000000) + 100000000000; // Generate a random number between 100bilion and 101bilion
      console.log(`${processId}: Checking ${num}`);
      for (let j = 2; j <= num; j++) {
        // checkedNumbers.push({ num, j }); //test JavaScript heap out of memory
        if (num % j === 10000000) {
          console.log(`${processId}: num and j are ${num} and ${j}`);
        }
      }
    }

    return `${processId}: Heavy task completed`;
  }

  @Get("test-failed")
  async testFailed(): Promise<void> {
    this.logger.log('Test failed job');
    await this.failedJobs().catch((error) => {
      this.logger.error(error);
    });
  }

  async failedJobs(): Promise<void> {
    throw new Error('Failed job');
  }

}
