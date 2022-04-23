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
import { getKeywordChart } from 'src/scripts/dashboard';

@Injectable()
export class KeywordChartMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private connection: Connection,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { projectId, filter } = req.query;
    const { url } = req;
    const { viewId, url: siteUrl } = await this.connection
      .model<ProjectDocument>('project')
      .findOne({ _id: projectId });
    const coll_name = `keywordChart_${projectId}_${url}`;
    const isCached = await this.cacheManager.get(coll_name);
    if (!isCached) {
      const web_endpoint = await getKeywordChart(
        req.user,
        viewId,
        siteUrl,
        filter,
      );
      if (filter && !filter[0].query) {
        let analytics = [];
        console.log('CALLING WEB AND DISCOVER END POINTS');
        const discover_endpoint = await getKeywordChart(
          req.user,
          viewId,
          siteUrl,
          filter,
          'Discover',
        );
        if (
          discover_endpoint[0] &&
          Object.keys(discover_endpoint[0]).length > 0
        ) {
          analytics = await mergeAnalyticsData(web_endpoint, discover_endpoint);
        } else {
          analytics = web_endpoint;
        }
        if (!web_endpoint.length) {
          throw new Error('Error getting results');
        }

        this.cacheManager.set(coll_name, analytics, { ttl: 2000 });
      } else {
        console.log('CALLING WEB END POINT ONLY');
        this.cacheManager.set(coll_name, web_endpoint, { ttl: 2000 });
      }
    }
    next();
  }
}

const mergeAnalyticsData = async (
  analyticsWithWebEndPoint,
  AnalyticsWithDiscoverEndPoint,
) => {
  const discover_endpoint = AnalyticsWithDiscoverEndPoint[0];
  const web_endpoint = analyticsWithWebEndPoint[0];

  for (const index in web_endpoint) {
    // console.log(web_endpoint[index].clicks + '  ' + web_endpoint[index].impressions + ' ' + web_endpoint[index].ctr);
    // console.log(discover_endpoint[index].clicks + ' ' + discover_endpoint[index].impressions + ' ' + discover_endpoint[index].ctr );
    analyticsWithWebEndPoint[0][index].clicks +=
      discover_endpoint[index].clicks;
    analyticsWithWebEndPoint[0][index].impressions +=
      discover_endpoint[index].impressions;
    analyticsWithWebEndPoint[0][index].ctr += discover_endpoint[index].ctr;
  }

  return Promise.all(analyticsWithWebEndPoint);
};
