import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ProjectDocument } from 'src/modules/project/schemas';
import {
  DataDocument,
  DataSchema,
  ClicksSchema,
  ClicksDocument,
  KeywordRankingDocument,
  KeywordRankingSchema,
  RevenueSchema,
  RevenueDocument,
} from '../schemas';

@Injectable()
export class DataService {
  static NAME = 'DataService';
  oauth2Client: any;

  constructor(@InjectConnection() private connection: Connection) {}
  async getTopPerformance(
    params,
    projectId,
  ): Promise<{ data: DataDocument[]; count: number }> {
    const { startRow, query, startDate, endDate } = params;
    let _filters, _sort;
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = sort;
    }
    const coll_name = `col_${projectId}_${startDate}_${endDate}`;
    this.connection.model(coll_name, DataSchema);
    const q = this.connection
      .model<DataDocument>(coll_name)
      .find(_filters)
      .collation({ locale: 'en_US', numericOrdering: true })
      .sort(_sort);
    const data = await q.limit(10).skip(Number(startRow || 0));
    const count = await this.connection
      .model<DataDocument>(coll_name)
      .find(_filters)
      .count();
    return { count, data };
  }

  async getClicks(
    params,
    projectId,
  ): Promise<{
    data: ClicksDocument[];
    info: {
      totalClick: number;
      totalImpressions: number;
      avgPositions: number;
      avgCtr: number;
    };
  }> {
    const { startDate, endDate, keyword } = params;
    const coll_name = `clicks_${projectId}_${startDate}_${endDate}_${keyword}`;
    this.connection.model(coll_name, ClicksSchema);
    const data = await this.connection
      .model<ClicksDocument>(coll_name)
      .find()
      .exec();
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
  }

  async getKeywordRanking(
    params,
    projectId,
  ): Promise<{ data: KeywordRankingDocument[]; count: number }> {
    const { startRow, query } = params;
    let _filters,
      _sort = { rank: -1 };
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = Object.keys(sort).length ? sort : { rank: -1 };
    }

    const coll_name = `${projectId}_keyword_rankings`;

    this.connection.model(coll_name, KeywordRankingSchema);
    const data = await this.connection
      .model<KeywordRankingDocument>(coll_name)
      .find(_filters)
      .sort(_sort)
      .limit(20)
      .skip(Number(startRow || 0))
      .collation({ locale: 'en_US', numericOrdering: true })
      .exec();
    const count = await this.connection
      .model<KeywordRankingDocument>(coll_name)
      .find(_filters)
      .count();
    return { count, data };
  }

  async getRevenuGraph(params): Promise<{
    organicResult: RevenueDocument[];
    result: RevenueDocument[];
    total: number;
    organicTotal: number;
  }> {
    const { projectId, startDate, endDate } = params;
    const col_name = `revenu_${projectId}_${startDate}_${endDate}`;
    this.connection.model(col_name, RevenueSchema);
    let result = await this.connection
      .model<RevenueDocument>(col_name)
      .find()
      .exec();
    const organicResult = result.filter((r) => r.type === 'organic');
    result = result.filter((r) => r.type === 'all');
    const organicTotal = organicResult.reduce((acc, curr) => {
      return (acc += Number(curr.revenue));
    }, 0);
    const total = result.reduce((acc, curr) => {
      return (acc += Number(curr.revenue));
    }, 0);
    return { total, result, organicTotal, organicResult };
  }

  async retrieveProjectsAssocaitedWithKeywords() {
    console.log('retrieveProjectsAssocaitedWithKeywords()');
    const projects = await this.connection
      .model<ProjectDocument>('project')
      .find();

    const project_details = projects
      .filter((project) => {
        return (
          typeof project.keywords !== 'undefined' && project.keywords.length > 0
        );
      })
      .map((project) => {
        const { _id, keywords, name, viewId, _url, createdBy } = project;
        return {
          _id,
          keywords,
          name,
          viewId,
          _url,
          createdBy,
        };
      });

    return project_details;
  }

  async retrieveProjects() {
    console.log('retrieveProjects()');
    const projects = await this.connection
      .model<ProjectDocument>('project')
      .find();

    const project_details = projects.map((project) => {
      const { _id, keywords, name, viewId, _url, createdBy } = project;
      return {
        _id,
        keywords,
        name,
        viewId,
        _url,
        createdBy,
      };
    });

    return project_details;
  }

  async storeKeywordRankings(keyword_rankings, project_id) {
    console.log('storeKeywordRankings()');
    const collection_name = project_id + '_keyword_rankings';
    try {
      await this.connection.model(collection_name, KeywordRankingSchema);
      await this.connection.createCollection(collection_name);
      await this.connection.model(collection_name).insertMany(keyword_rankings);
    } catch (e) {
      await this.connection.dropCollection(collection_name);
      await this.connection.model(collection_name, KeywordRankingSchema);
      await this.connection.createCollection(collection_name);
      await this.connection.model(collection_name).insertMany(keyword_rankings);
    }
  }
}
