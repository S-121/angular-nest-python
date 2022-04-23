import {
  Module,
  CacheModule,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { Keywordcontroller } from './controllers';
import { KeywordService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { KeywordSchema, KEYWORD_COLLECTION_NAME } from './schemas';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeatureAsync([
      {
        name: KEYWORD_COLLECTION_NAME,
        useFactory: () => {
          const schema = KeywordSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [Keywordcontroller],
  providers: [KeywordService],
})
export class KeywordModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(KeywordMiddleware)
    //   .forRoutes({ path: 'keyword/', method: RequestMethod.GET });
  }
}
