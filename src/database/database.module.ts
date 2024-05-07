import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';


import models from './models';

export interface DatabaseConfig {
  connection: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  schema: string;
}
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => {
        return {
          models: models,
          operatorsAliases: null,
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '123456',
          database: 'postgres',
          dialect: 'postgres' as Dialect,
          // native: true,
          define: {
            schema: 'public',
            paranoid: true,
            timestamps: true,
            underscored: true,
          },
          pool: { max: 8 },
          logging: true,
        };
      },
    }),
    SequelizeModule.forFeature(models),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
