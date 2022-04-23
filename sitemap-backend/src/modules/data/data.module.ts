import {
  Module,
  CacheModule,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as redisStore from 'cache-manager-redis-store';

import { DataController } from './controllers';
import { DataService } from './services';
import {
  DataSchema,
  DATA_COLLECTION_NAME,
  ClicksSchema,
  CLICKS_COLLECTION_NAME,
  RevenueSchema,
  REVENUE_COLLECTION_NAME,
} from './schemas';
import {
  GoogleSearchMiddleware,
  ClicksMiddleware,
  KeywordRankingMiddleware,
  RevenueGraphhMiddleware,
} from 'src/middlewares';
import {
  KEYWORD_RANKING_COLLECTION_NAME,
  KeywordRankingSchema,
} from './schemas/keywordRanking.schema';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    MongooseModule.forFeature([
      // { name: DATA_COLLECTION_NAME, schema: DataSchema },
      // { name: CLICKS_COLLECTION_NAME, schema: ClicksSchema },
      // { name: KEYWORD_RANKING_COLLECTION_NAME, schema: KeywordRankingSchema },
      // { name: REVENUE_COLLECTION_NAME, schema: RevenueSchema },
    ]),
  ],
  controllers: [DataController],
  providers: [DataService],
  exports: [],
})
export class DataModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GoogleSearchMiddleware)
      .forRoutes({ path: 'data/top-performance', method: RequestMethod.GET });
    consumer.apply(ClicksMiddleware).forRoutes({
      path: 'data/clicks',
      method: RequestMethod.GET,
    });
    // consumer.apply(KeywordRankingMiddleware).forRoutes({
    //   path: 'data/keyword-ranking',
    //   method: RequestMethod.GET,
    // });
    consumer.apply(RevenueGraphhMiddleware).forRoutes({
      path: 'data/revenue',
      method: RequestMethod.GET,
    });
  }
}
