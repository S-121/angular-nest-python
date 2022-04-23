import {
  Module,
  CacheModule,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ProjectController } from './controllers';
import { ProjectService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema, PROJECT_COLLECTION_NAME } from './schemas';
import {
  AccurankerDomainsMiddleware,
  GaPropertiesMiddleware,
  GaViewsOfPropertyMiddleware,
  GscSitesMiddleware,
} from 'src/middlewares/projects';
import { UserModule } from '../user';

@Module({
  imports: [
    CacheModule.register(),
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: PROJECT_COLLECTION_NAME,
        useFactory: () => {
          const schema = ProjectSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AccurankerDomainsMiddleware).forRoutes({
    //   path: 'project/accurDomain',
    //   method: RequestMethod.GET,
    // });
    consumer.apply(GaPropertiesMiddleware).forRoutes({
      path: 'project/gaProperties',
      method: RequestMethod.GET,
    });
    consumer.apply(GaViewsOfPropertyMiddleware).forRoutes({
      path: 'project/gaViewOfProperty',
      method: RequestMethod.GET,
    });
    consumer.apply(GscSitesMiddleware).forRoutes({
      path: 'project/gscSites',
      method: RequestMethod.GET,
    });
  }
}
