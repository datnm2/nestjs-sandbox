import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeatureController } from './feature.controller';
import { ApiVersioningMiddleware } from './api-versioning.middleware';
import { AuthMiddleware } from './auth.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { GroupListener } from './listeners/group.listener';
import { TestShutDownService } from './test-shutdown.service';
import { TestShutDownService2 } from './test-shutdown.service2';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      verboseMemoryLeak: true,
      maxListeners: 10,
    }),
    DatabaseModule,
  ],
  controllers: [AppController, FeatureController],
  providers: [AppService, DatabaseModule,TestShutDownService2],
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
