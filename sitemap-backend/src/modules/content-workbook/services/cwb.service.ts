import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ProjectService } from 'src/modules/project';
import {
  CWBSettingsSchema,
  CWBSettingsDocument,
  CWBQueueSchema,
} from '../schemas';

@Injectable()
export class CWBService {
  constructor(
    @InjectConnection() private connection: Connection,
    private readonly projectService: ProjectService,
  ) {}

  async isPublished(params, item) {
    const [statusOptions] = await this.getSettings(params, {
      property: 'Status',
    });
    if (!statusOptions || !statusOptions?.options) {
      return item;
    }
    const options = JSON.parse(statusOptions.options);
    const status = options.find((option) => option.id === item.status)?.value;
    if (
      String(status).toLocaleLowerCase().trim() === 'published' &&
      !item.published
    ) {
      const date = new Date();
      item.published = true;
      item.publishedDate = `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}`;
    } else if (String(status).toLocaleLowerCase().trim() !== 'published') {
      item.published = false;
      item.publishedDate = null;
    }
    return item;
  }

  async isDisapproved(params, item) {
    const [statusOptions] = await this.getSettings(params, {
      property: 'Status',
    });
    if (!statusOptions || !statusOptions?.options) {
      return item;
    }
    const options = JSON.parse(statusOptions.options);
    const status = options.find((option) => option.id === item.status)?.value;
    if (
      String(status).toLocaleLowerCase().trim() === 'disapproved' &&
      !item.published
    ) {
      const date = new Date();
      item.disapproved = true;
      item.disapprovedDate = `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}`;
    } else if (String(status).toLocaleLowerCase().trim() !== 'published') {
      item.disapproved = false;
      item.disapprovedDate = null;
    }
    return item;
  }

  async updateRows(params, body): Promise<any> {
    const { projectId } = params;
    let { rows } = body;
    const col_name = `cwb_queue_${projectId}`;
    await this.connection.model(col_name, CWBQueueSchema);
    await this.connection.model(col_name).remove({});
    const _rows = [];
    for (let i = 0; i < rows.length; i++) {
      let row = await this.isPublished(params, rows[i]);
      row = await this.isDisapproved(params, rows[i]);
      _rows.push(row);
    }
    await this.connection.model(col_name).insertMany(_rows);
  }
  async getSettings(params, filter = {}): Promise<CWBSettingsDocument[]> {
    const { projectId } = params;
    const col_name = `cwb_settings`;
    await this.connection.model(col_name, CWBSettingsSchema);
    const data = await this.connection
      .model<CWBSettingsDocument>(col_name)
      .find(filter)
      .exec();
    return data;
  }

  async updateSettings(params, body): Promise<any> {
    const { projectId } = params;
    const { property, options } = body;
    const col_name = `cwb_settings`;
    await this.connection.model(col_name, CWBSettingsSchema);
    return await this.connection
      .model<CWBSettingsDocument>(col_name)
      .updateOne(
        { property },
        { $set: { property, options } },
        { upsert: true },
      )
      .exec();
  }

  async getPublished(params): Promise<{ count: number; data: any[] }> {
    const { projectId, offset, query } = params;
    let _filters, _sort;
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = sort;
    }

    const col_name = `cwb_queue_${projectId}`;
    await this.connection.model(col_name, CWBQueueSchema);
    const data = await this.connection
      .model(col_name)
      .find({ published: true }, { _id: false, __v: false })
      .sort({ priority: 1 })
      .collation({ locale: 'en_US', numericOrdering: true })
      .exec();
    const count = await this.connection.model(col_name).find(_filters).count();
    return {
      count,
      data,
    };
  }

  async getDisapproved(params): Promise<{ count: number; data: any[] }> {
    const { projectId, offset, query } = params;
    let _filters, _sort;
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = sort;
    }

    const col_name = `cwb_queue_${projectId}`;
    await this.connection.model(col_name, CWBQueueSchema);
    const data = await this.connection
      .model(col_name)
      .find({ disapproved: true }, { _id: false, __v: false })
      .sort({ priority: 1 })
      .collation({ locale: 'en_US', numericOrdering: true })
      .exec();
    const count = await this.connection.model(col_name).find(_filters).count();
    return {
      count,
      data,
    };
  }

  async getQueue(params): Promise<{ count: number; data: any[] }> {
    const { projectId, offset, query } = params;
    let _filters, _sort;
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = sort;
    }

    const col_name = `cwb_queue_${projectId}`;
    await this.connection.model(col_name, CWBQueueSchema);
    const data = await this.connection
      .model(col_name)
      .find(_filters, {
        _id: false,
        __v: false,
      })
      .sort({ priority: 1 })
      .collation({ locale: 'en_US', numericOrdering: true })
      // .limit(11)
      // .skip(Number(offset || 0))
      .exec();

    const count = await this.connection.model(col_name).find(_filters).count();
    return {
      count,
      data,
    };
  }

  async updateRow(params, body): Promise<any> {
    const { projectId } = params;
    const _col_name = `keyword_research_${projectId}`;
    await this.connection.model(_col_name, CWBQueueSchema);
    return await this.connection
      .model(_col_name)
      .updateOne({ id: body.id }, { $set: body }, { upsert: true });
  }
}
