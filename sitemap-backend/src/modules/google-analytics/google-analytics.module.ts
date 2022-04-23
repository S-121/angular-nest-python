import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  CacheModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as redisStore from 'cache-manager-redis-store';

import { GAController } from './controllers';
import { GAService } from './services';
import {
  GA_USER_COLLECTION_NAME,
  GaUserSchema,
  LANDING_PAGES_USER_COLLECTION_NAME,
  PERFORMANCE_COLLECTION_NAME,
  LandingPagesSchema,
  PerformanceSchema,
  ORGANIC_DATA_COLLECTION_NAME,
  OrganicDataSchema,
  DETAIL_PERFORMANCE_COLLECTION_NAME,
  DetailedPerformanceSchema,
} from './schemas';
import {
  GaUserMiddleware,
  LandingPageMiddleware,
  PerformanceMiddleware,
  OrganicDataMiddleware,
} from 'src/middlewares';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    MongooseModule.forFeature([
      { name: GA_USER_COLLECTION_NAME, schema: GaUserSchema },
      { name: LANDING_PAGES_USER_COLLECTION_NAME, schema: LandingPagesSchema },
      { name: PERFORMANCE_COLLECTION_NAME, schema: PerformanceSchema },
      { name: ORGANIC_DATA_COLLECTION_NAME, schema: OrganicDataSchema },
      {
        name: DETAIL_PERFORMANCE_COLLECTION_NAME,
        schema: DetailedPerformanceSchema,
      },
    ]),
  ],
  controllers: [GAController],
  providers: [GAService],
  exports: [],
})
export class GoogleAnalyticsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GaUserMiddleware)
      .forRoutes({ path: 'ga/user', method: RequestMethod.GET });
    consumer
      .apply(LandingPageMiddleware)
      .forRoutes({ path: 'ga/landing-pages', method: RequestMethod.GET });
    consumer
      .apply(PerformanceMiddleware)
      .forRoutes({ path: 'ga/performance-data', method: RequestMethod.GET });
    consumer
      .apply(OrganicDataMiddleware)
      .forRoutes({ path: 'ga/organic-data', method: RequestMethod.GET });
  }
}
