import {
  Injectable,
  NestMiddleware,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Cache } from 'cache-manager';
import { syncSiteData } from 'src/scripts';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { DataSchema } from 'src/modules/data/schemas';
import { ProjectDocument } from 'src/modules/project/schemas';

@Injectable()
export class GoogleSearchMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private connection: Connection,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { projectId, startDate, endDate } = req.query;
    const { viewId, url } = await this.connection
      .model<ProjectDocument>('project')
      .findOne({ _id: projectId });
    const coll_name = `col_${projectId}_${startDate}_${endDate}`;
    const isCached = await this.cacheManager.get(coll_name);
    if (!isCached) {
      const rows = await syncSiteData(
        req.user,
        viewId,
        url,
        startDate,
        endDate,
      );
      this.cacheManager.set(coll_name, true, { ttl: 1000 });
      await this.populateDB(coll_name, rows);
    }
    next();
  }

  async populateDB(collectionName, rows) {
    try {
      await this.connection.model(collectionName, DataSchema);
      await this.connection.dropCollection(collectionName);
    } catch (err) {
    } finally {
      await this.connection.model(collectionName).remove({});
      await this.connection.model(collectionName, DataSchema);
      await this.connection.createCollection(collectionName);
      await this.connection.model(collectionName).insertMany(rows);
    }
  }
}
