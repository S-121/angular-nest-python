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
import { ProjectDocument } from 'src/modules/project/schemas';
import { getRevenue } from 'src/scripts/dashboard';

@Injectable()
export class RevenueMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private connection: Connection,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { projectId, filter } = req.query;
    const { url } = req;
    const { viewId, projectConversions } = await this.connection
      .model<ProjectDocument>('project')
      .findOne({ _id: projectId });
    const coll_name = `revenu_${projectId}_${url}`;
    const isCached = await this.cacheManager.get(coll_name);
    if (!isCached) {
      const rows = await getRevenue(req.user, viewId, filter, projectConversions);
      this.cacheManager.set(coll_name, rows, { ttl: 2000 });
    }
    next();
  }
}
