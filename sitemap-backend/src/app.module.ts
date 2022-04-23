import {
  Module,
  CacheModule,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataModule, ProjectModule, UserModule } from './modules';
import * as redisStore from 'cache-manager-redis-store';
import { GoogleAnalyticsModule } from './modules/google-analytics/google-analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { KeywordModule } from './modules/keyword';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as mongoose from 'mongoose';
import { WqaModule } from './modules/wqa';
import { CWBModule } from './modules/content-workbook';
import { DashboardModule } from './modules/dashboard';
import { AuthMiddleware } from './auth.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module'
import { ConfigModule } from '@nestjs/config';

mongoose.pluralize(null);
@Module({
  controllers: [],
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    DataModule,
    ProjectModule,
    DashboardModule,
    CWBModule,
    GoogleAnalyticsModule,
    UserModule,
    AuthModule,
    KeywordModule,
    WqaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    ConfigModule.forRoot()
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
