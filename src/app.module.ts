import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeatureController } from './feature.controller';
import { ApiVersioningMiddleware } from './api-versioning.middleware';
import { AuthMiddleware } from './auth.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { Queue } from 'bullmq';
import { QueueModule } from './queue/queue.module';
import { BicController } from './bic/bic.controller';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      verboseMemoryLeak: true,
      maxListeners: 10,
    }),
    DatabaseModule,
    QueueModule
  ],
  controllers: [AppController, FeatureController, BicController],
  providers: [AppService, DatabaseModule],
  exports: [DatabaseModule],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer;
    consumer
      .apply(ApiVersioningMiddleware)
      .forRoutes('*')
      .apply(AuthMiddleware)
      .exclude('/feature/(.*)')
      .forRoutes('*');
  }
}
