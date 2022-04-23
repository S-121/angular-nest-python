import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class DashboardService {
  static NAME = 'DashboardService';
  oauth2Client: any;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getRevenu(params, req): Promise<any> {
    const { projectId } = params;
    const { url } = req;
    const coll_name = `revenu_${projectId}_${url}`;
    const rows = await this.cacheManager.get(coll_name);
    return rows.map((row) => {
      return {
        organicResult: row.filter((r) => r.type === 'organic'),
        result: row.filter((r) => r.type === 'all'),
        organicTotal: row
          .filter((r) => r.type === 'organic')
          .reduce((acc, curr) => {
            return (acc += Number(curr.revenue));
          }, 0),
        total: row
          .filter((r) => r.type === 'all')
          .reduce((acc, curr) => {
            return (acc += Number(curr.revenue));
          }, 0),

        conversion_type: row[0].conversion_type,
      };
    });
  }

  async getKeywordChart(params, req): Promise<any> {
    const { projectId } = params;
    const { url } = req;
    const coll_name = `keywordChart_${projectId}_${url}`;
    const rows = await this.cacheManager.get(coll_name);
    console.log('keywordChart_', rows);
    return rows.map((data) => {
      console.log('keywordChart_row', data);
      if (Array.isArray(data)) {
        const info = data.reduce(
          (acc, curr) => {
            return {
              totalClick: acc.totalClick + curr.clicks,
              totalImpressions: acc.totalImpressions + curr.impressions,
              avgPositions: acc.avgPositions + curr.position,
              avgCtr: acc.avgCtr + curr.ctr,
            };
          },
          {
            totalClick: 0,
            totalImpressions: 0,
            avgPositions: 0,
            avgCtr: 0,
          },
        );
        info.avgCtr /= data.length;
        info.avgPositions /= data.length;
        return { data, info };
      } else {
        return {
          data: [],
          info: {},
        };
      }
    });
  }

  async getTopPerforming(params, req): Promise<any> {
    const { projectId } = params;
    const { url } = req;
    const coll_name = `top_performing_${projectId}_${url}`;
    const rows = await this.cacheManager.get(coll_name);
    return rows.map((row) => {
      return {
        data: row,
        count: 1000,
      };
    });
  }
}
