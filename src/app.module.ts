import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeatureController } from './feature.controller';
import { ApiVersioningMiddleware } from './api-versioning.middleware';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [],
  controllers: [AppController, FeatureController],
  providers: [AppService],
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
