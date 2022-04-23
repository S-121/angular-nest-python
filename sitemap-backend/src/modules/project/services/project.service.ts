import { Injectable } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import * as parse from 'csv-parse/lib/sync';
import {
  PROJECT_COLLECTION_NAME,
  ProjectDocument,
  GaPropertySchema,
  GaPropertyDocument,
  DomainDocument,
  DomainSchema,
  GscSiteSchema,
  GscSiteDocument,
  ViewsDocument,
  ViewsSchema,
} from '../schemas';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { WQASchema } from 'src/modules/wqa/schemas';

@Injectable()
export class ProjectService {
  oauth2Client: any;

  constructor(
    @InjectModel(PROJECT_COLLECTION_NAME)
    private projectModel: Model<ProjectDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async deleteProject(_id): Promise<ProjectDocument> {
    return this.projectModel.remove({ _id });
  }

  async gaProperties(): Promise<GaPropertyDocument[]> {
    const coll_name = `gaproperties`;
    this.connection.model(coll_name, GaPropertySchema);
    const data = await this.connection
      .model<GaPropertyDocument>(coll_name)
      .find()
      .exec();
    return data;
  }

  async gscSite(): Promise<GscSiteDocument[]> {
    const coll_name = `gscSites`;
    this.connection.model(coll_name, GscSiteSchema);
    const data = await this.connection
      .model<GscSiteDocument>(coll_name)
      .find()
      .exec();
    return data;
  }

  async domain(): Promise<DomainDocument[]> {
    const coll_name = `domain`;
    this.connection.model(coll_name, DomainSchema);
    const data = await this.connection
      .model<DomainDocument>(coll_name)
      .find()
      .exec();
    return data;
  }

  async gaViewOfProperty(accountId, webPropertyId): Promise<ViewsDocument[]> {
    const coll_name = `views_${accountId}_${webPropertyId}`;
    this.connection.model(coll_name, ViewsSchema);
    const data = await this.connection
      .model<ViewsDocument>(coll_name)
      .find()
      .exec();
    return data;
  }

  async getProjects(user): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ $or: [{ createdBy: user.id }, { users: user.email }] })
      .exec();
  }

  async getProjectById(id): Promise<ProjectDocument> {
    return this.projectModel.findOne({ _id: id }).exec();
  }

  async createProject(body, user): Promise<ProjectDocument> {
    const { keywords } = body;

    body.keywords = this.projectKeywords(keywords);
    const project = new this.projectModel({
      ...body,
      createdBy: user.id,
      admin: user.top_admin,
    });
    const p = await project.save();
    const { csv } = body;
    if (csv) {
      await this.saveCSV(p.id, csv);
      delete body.csv;
    }
    return p;
  }

  async updateProject(id, body): Promise<any> {
    const { csv, keywords } = body;
    
    body.keywords = this.projectKeywords(keywords.toString());
    if (csv) {
      await this.saveCSV(id, csv);
      delete body.csv;
    }
    return this.projectModel.update({ _id: id }, { $set: { ...body } });
  }

  async saveCSV(id, csv) {
    const collectionName = `master_quality_${id}`;
    const rows = parse(Buffer.from(csv, 'base64').toString().trim(), {
      columns: true,
      skip_empty_lines: true,
    });

    try {
      await this.connection.model(collectionName, WQASchema);
      await this.connection.dropCollection(collectionName);
    } catch (err) {
    } finally {
      await this.connection.model(collectionName).remove({});
      await this.connection.model(collectionName, WQASchema);
      await this.connection.createCollection(collectionName);
      await this.connection.model(collectionName).insertMany(rows);
    }
  }

  projectKeywords(keywords) {
    let project_keywords = [];
    project_keywords = keywords.replace(/,\s*$/, "").split(',');
    project_keywords = project_keywords.map((keyword) => {
      return keyword.trim();
    });

    return project_keywords;
  }
}
