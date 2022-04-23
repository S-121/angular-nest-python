import {
  Injectable,
  NestMiddleware,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Cache } from 'cache-manager';
import { syncClicksData } from 'src/scripts';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ClicksSchema } from 'src/modules/data/schemas';
import { ProjectDocument } from 'src/modules/project/schemas';

@Injectable()
export class ClicksMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private connection: Connection,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { projectId, startDate, endDate, keyword } = req.query;
    const { viewId, url } = await this.connection
      .model<ProjectDocument>('project')
      .findOne({ _id: projectId });
    const coll_name = `clicks_${projectId}_${startDate}_${endDate}_${keyword}`;
    const isCached = await this.cacheManager.get(coll_name);
    if (!isCached) {
      const rows = await syncClicksData(
        req.user,
        viewId,
        url,
        startDate,
        endDate,
        keyword,
      );
      this.cacheManager.set(coll_name, true, { ttl: 1000 });
      await this.populateDB(coll_name, rows);
    }
    next();
  }

  async populateDB(collectionName, rows) {
    try {
      await this.connection.model(collectionName, ClicksSchema);
      await this.connection.dropCollection(collectionName);
    } catch (err) {
    } finally {
      await this.connection.model(collectionName).remove({});
      await this.connection.model(collectionName, ClicksSchema);
      await this.connection.createCollection(collectionName);
      await this.connection.model(collectionName).insertMany(rows);
    }
  }
}
