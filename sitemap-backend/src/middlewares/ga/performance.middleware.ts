import {
  Injectable,
  NestMiddleware,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Cache } from 'cache-manager';
import { getPerformance } from 'src/scripts';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ProjectDocument } from 'src/modules/project/schemas';
import { GAService } from 'src/modules/google-analytics/services';

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private connection: Connection,
    private gaService: GAService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { projectId } = req.query;
    const { viewId } = await this.connection
      .model<ProjectDocument>('project')
      .findOne({ _id: projectId });
    const coll_name = `performance_${projectId}`;
    const isCached = await this.cacheManager.get(coll_name);
    const detailed_coll_name = `performance_detail_${projectId}`;
    if (!isCached) {
      const { breif, detailed } = await getPerformance(req.user, viewId);
      this.cacheManager.set(coll_name, true, { ttl: 86000 });
      await this.gaService.populateDB(coll_name, breif);
      await this.gaService.populateDetailedDB(detailed_coll_name, detailed);
    }
    next();
  }
}
