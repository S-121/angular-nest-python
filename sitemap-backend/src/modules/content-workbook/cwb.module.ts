import { Module, CacheModule } from '@nestjs/common';
import { CWBController } from './controllers';
import { CWBService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from '../project';

@Module({
  imports: [
    ProjectModule,
    CacheModule.register(),
    MongooseModule.forFeatureAsync([]),
  ],
  controllers: [CWBController],
  providers: [CWBService],
})
export class CWBModule {}
