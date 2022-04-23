import {
  Injectable,
  NestMiddleware,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Cache } from 'cache-manager';
import { getKeywordRanking } from 'src/scripts';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { KeywordRankingSchema } from 'src/modules/data/schemas';

@Injectable()
export class KeywordRankingMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private connection: Connection,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { accuDomain, startDate, endDate } = req.query;

    const coll_name = `ranking_${accuDomain}`;

    const isCached = await this.cacheManager.get(coll_name);
    if (!isCached) {
      const rows = await getKeywordRanking(accuDomain, startDate, endDate);
      this.cacheManager.set(coll_name, true, { ttl: 10000 });
      await this.populateDB(coll_name, rows);
    }
    next();
  }

  async populateDB(collectionName, rows) {
    try {
      await this.connection.model(collectionName, KeywordRankingSchema);
      await this.connection.dropCollection(collectionName);
    } catch (err) {
    } finally {
      await this.connection.model(collectionName).remove({});
      await this.connection.model(collectionName, KeywordRankingSchema);
      await this.connection.createCollection(collectionName);
      await this.connection.model(collectionName).insertMany(rows);
    }
  }
}
