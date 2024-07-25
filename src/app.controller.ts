import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TestModel } from './database/models';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { ITestAttribute } from './database/models/test.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @InjectModel(TestModel)
    private readonly testModel: typeof TestModel
  ) { }

  @Get()
  async getHello(): Promise<ITestAttribute[]> {
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
    return [];
  }
}
