import {
  Injectable,
  NestMiddleware,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Cache } from 'cache-manager';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { getKeyword } from 'src/scripts';
import { KeywordSchema } from 'src/modules/keyword/schemas';
import { ProjectDocument } from 'src/modules/project/schemas';

@Injectable()
export class KeywordMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private connection: Connection,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { index, projectId } = req.query;
    const { sheetId } = await this.connection
      .model<ProjectDocument>('project')
      .findOne({ _id: projectId });

    const coll_name = `keyword_${projectId}_${index}`;
    const isCached = await this.cacheManager.get(coll_name);
    if (!isCached) {
      const rows = await getKeyword(+index, sheetId);
      this.cacheManager.set(coll_name, true, { ttl: 1000 });
      await this.populateDB(coll_name, rows);
    }
    next();
  }

  async populateDB(collectionName, rows) {
    try {
      await this.connection.model(collectionName, KeywordSchema);
      await this.connection.dropCollection(collectionName);
    } catch (err) {
    } finally {
      await this.connection.model(collectionName).remove({});
      await this.connection.model(collectionName, KeywordSchema);
      await this.connection.createCollection(collectionName);
      await this.connection.model(collectionName).insertMany(rows);
    }
  }
}
