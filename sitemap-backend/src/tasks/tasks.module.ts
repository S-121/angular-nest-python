import { Module, CacheModule } from '@nestjs/common';
import { DataService } from 'src/modules';
import { TasksService } from './tasks.service';
import * as redisStore from 'cache-manager-redis-store';
import { GAService } from 'src/modules/google-analytics/services';
import { TasksPageSpeedService } from './taskPageSpeed.service';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  providers: [TasksService, DataService, GAService, TasksPageSpeedService],
  imports: [
    ScheduleModule.forRoot(),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
})
export class TasksModule {}
