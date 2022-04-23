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
import { getTopPerforming } from 'src/scripts/dashboard';

@Injectable()
export class TopPerformingMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private connection: Connection,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { projectId, filter, offset } = req.query;
    const { url } = req;
    const {
      viewId,
      url: siteUrl,
    } = await this.connection
      .model<ProjectDocument>('project')
      .findOne({ _id: projectId });
    const coll_name = `top_performing_${projectId}_${url}`;
    const isCached = await this.cacheManager.get(coll_name);

    if (!isCached) {
      const rows = await getTopPerforming(
        req.user,
        viewId,
        siteUrl,
        filter,
        offset,
      );
      this.cacheManager.set(coll_name, rows, { ttl: 2000 });
    }
    next();
  }
}
