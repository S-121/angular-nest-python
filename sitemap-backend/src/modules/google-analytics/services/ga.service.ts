import { Injectable } from '@nestjs/common';
import {
  GaUserDocument,
  GaUserSchema,
  LandingPagesSchema,
  LandingPagesDocument,
  PerformanceDocument,
  PerformanceSchema,
  OrganicDataDocument,
  OrganicDataSchema,
  DetailedPerformanceSchema,
  DetailedPerformanceDocument,
} from '../schemas';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class GAService {
  static NAME = 'GAService';
  oauth2Client: any;

  constructor(@InjectConnection() private connection: Connection) {}

  async gaUser(
    params,
    projectId,
  ): Promise<{ months: string[]; users: string[]; sessions: string[] }> {
    const coll_name = `gaUser_${projectId}`;
    const output = { months: [], users: [], sessions: [], views: [] };
    this.connection.model(coll_name, GaUserSchema);
    const data = await this.connection
      .model<GaUserDocument>(coll_name)
      .find()
      .exec();

    data.forEach(({ month, users, sessions, views }) => {
      output.months.push(month);
      output.users.push(users);
      output.sessions.push(sessions);
      output.views.push(views);
    });
    return output;
  }

  async getLandingPages(
    params,
    projectId,
  ): Promise<{ data: LandingPagesDocument[]; count: number }> {
    const coll_name = `landing_pages_${projectId}`;
    const { startRow, query } = params;
    let _filters,
      _sort = { sessions: -1 };
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = Object.keys(sort).length ? sort : { sessions: -1 };
    }

    this.connection.model(coll_name, LandingPagesSchema);

    const data = await this.connection
      .model<LandingPagesDocument>(coll_name)
      .find(_filters)
      .sort(_sort)
      .collation({ locale: 'en_US', numericOrdering: true })
      .limit(10)
      .skip(Number(startRow || 0))
      .exec();
    const count = await this.connection
      .model<LandingPagesDocument>(coll_name)
      .find(_filters)
      .count();
    return { count, data };
  }

  async getPerformance(
    params,
    projectId,
  ): Promise<{ data: PerformanceDocument[]; count: number }> {
    const coll_name = `performance_${projectId}`;
    const { startRow, query } = params;
    let _filters, _sort;
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = sort;
    }

    this.connection.model(coll_name, PerformanceSchema);
    const data = await this.connection
      .model<PerformanceDocument>(coll_name)
      .find(_filters)
      .sort(_sort)
      .collation({ locale: 'en_US', numericOrdering: true })
      .limit(20)
      .skip(Number(startRow || 0))
      .exec();
    const count = await this.connection
      .model<PerformanceDocument>(coll_name)
      .find(_filters)
      .count();
    return { count, data };
  }

  async getPerformanceData(
    params,
    projectId,
  ): Promise<{ data: DetailedPerformanceDocument[]; count: number }> {
    const coll_name = `performance_detail_${projectId}`;
    const { startRow, query } = params;
    let _filters, _sort;
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = sort;
    }
    if (!_filters) {
      _filters = {};
    }
    _filters.record_date = {
      $gt: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    };

    this.connection.model(coll_name, DetailedPerformanceSchema);
    const data = await this.connection
      .model<DetailedPerformanceDocument>(coll_name)
      .find(_filters)
      .sort(_sort)
      .collation({ locale: 'en_US', numericOrdering: true })
      .limit(0)
      .skip(Number(startRow || 0))
      .exec();
    const count = await this.connection
      .model<DetailedPerformanceDocument>(coll_name)
      .find(_filters)
      .count();
    return { count, data };
  }

  async getOrganicData(params, projectId): Promise<OrganicDataDocument> {
    const coll_name = `organic_data_${projectId}`;
    this.connection.model(coll_name, OrganicDataSchema);
    const data = await this.connection
      .model<OrganicDataDocument>(coll_name)
      .findOne()
      .exec();
    return data;
  }

  async populateDB(collectionName, rows) {
    try {
      await this.connection.model(collectionName, PerformanceSchema);
      await this.connection.dropCollection(collectionName);
    } catch (err) {
    } finally {
      await this.connection.model(collectionName).remove({});
      await this.connection.model(collectionName, PerformanceSchema);
      await this.connection.createCollection(collectionName);
      await this.connection.model(collectionName).insertMany(rows);
    }
  }

  async populateDetailedDB(collectionName, rows) {
    try {
      await this.connection.model(collectionName, DetailedPerformanceSchema);
      await this.connection.model(collectionName).insertMany(rows);
    } catch (err) {
      console.log(err);
    }
  }
}
