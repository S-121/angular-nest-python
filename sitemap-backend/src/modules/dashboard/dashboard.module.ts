import {
  Module,
  CacheModule,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { DashboardController } from './controllers';
import { DashboardService } from './services';
import {
  RevenueMiddleware,
  KeywordChartMiddleware,
  TopPerformingMiddleware,
} from 'src/middlewares';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [],
})
export class DashboardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RevenueMiddleware).forRoutes({
      path: 'dashboard/revenue',
      method: RequestMethod.GET,
    });
    consumer.apply(KeywordChartMiddleware).forRoutes({
      path: 'dashboard/keyword-chart',
      method: RequestMethod.GET,
    });
    consumer.apply(TopPerformingMiddleware).forRoutes({
      path: 'dashboard/top-performing',
      method: RequestMethod.GET,
    });
  }
}
