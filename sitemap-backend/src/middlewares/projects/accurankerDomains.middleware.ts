import {
  Injectable,
  NestMiddleware,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Cache } from 'cache-manager';
import { accurankerDomains } from 'src/scripts';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { DomainSchema } from 'src/modules/project/schemas';

@Injectable()
export class AccurankerDomainsMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private connection: Connection,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const coll_name = `domain`;
    const isCached = await this.cacheManager.get(coll_name);
    if (!isCached) {
      const rows = await accurankerDomains();
      this.cacheManager.set(coll_name, true, { ttl: 1000 });
      await this.populateDB(coll_name, rows);
    }
    next();
  }

  async populateDB(collectionName, rows) {
    try {
      await this.connection.model(collectionName, DomainSchema);
      await this.connection.dropCollection(collectionName);
    } catch (err) {
    } finally {
      await this.connection.model(collectionName).remove({});
      await this.connection.model(collectionName, DomainSchema);
      await this.connection.createCollection(collectionName);
      await this.connection.model(collectionName).insertMany(rows);
    }
  }
}
