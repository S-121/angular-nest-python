import {
  Injectable,
  NestMiddleware,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Cache } from 'cache-manager';
import { gaViewsOfProperty } from 'src/scripts';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ViewsSchema } from 'src/modules/project/schemas';

@Injectable()
export class GaViewsOfPropertyMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private connection: Connection,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { accountId, webPropertyId } = req.query;
    const coll_name = `views_${accountId}_${webPropertyId}`;
    const isCached = await this.cacheManager.get(coll_name);
    if (!isCached) {
      const rows = await gaViewsOfProperty(req.user, accountId, webPropertyId);
      this.cacheManager.set(coll_name, true, { ttl: 1000 });
      await this.populateDB(coll_name, rows);
    }
    next();
  }

  async populateDB(collectionName, rows) {
    try {
      await this.connection.model(collectionName, ViewsSchema);
      await this.connection.dropCollection(collectionName);
    } catch (err) {
    } finally {
      await this.connection.model(collectionName).remove({});
      await this.connection.model(collectionName, ViewsSchema);
      await this.connection.createCollection(collectionName);
      await this.connection.model(collectionName).insertMany(rows);
    }
  }
}
