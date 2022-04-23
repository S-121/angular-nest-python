import { Module, CacheModule } from '@nestjs/common';
import { WqaController } from './controllers';
import { WQAService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { WQASchema, WQA_COLLECTION_NAME } from './schemas';
import { ProjectModule } from '../project';

@Module({
  imports: [
    ProjectModule,
    CacheModule.register(),
    MongooseModule.forFeatureAsync([
      {
        name: WQA_COLLECTION_NAME,
        useFactory: () => {
          const schema = WQASchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [WqaController],
  providers: [WQAService],
})
export class WqaModule {}
