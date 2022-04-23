import { Injectable } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { KeywordSchema, KeywordDocument, KEYWORD_COLLECTION_NAME } from '../schemas';
import { ObjectId } from 'mongodb';

@Injectable()
export class KeywordService {
  oauth2Client: any;

  constructor(
    @InjectModel(KEYWORD_COLLECTION_NAME)
    private keywordModel: Model<KeywordDocument>,
    @InjectConnection()
    private connection: Connection
  ) {}

  async getTargetKeyword(params): Promise<{ count: number; data: any[] }> {
    const { projectId, offset, query } = params;
    let _filters, _sort;
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = sort;
    }

    const col_name = `keyword_research_${projectId}`;
    await this.connection.model(col_name, KeywordSchema);
    const data = await this.connection
      .model(col_name)
      .find({ targetPage: true }, { _id: false, __v: false })
      .sort({ priority: 1 })
      .collation({ locale: 'en_US', numericOrdering: true })
      .limit(11)
      .skip(Number(offset || 0))
      .exec();
    const count = await this.connection.model(col_name).find(_filters).count();
    return {
      count,
      data,
    };
  }

  async getKeyword(
    params,
  ): Promise<{ count: number; data: any[]; maxPriorityScore: number }> {
    const { projectId, offset, query } = params;
    let _filters, _sort;
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = sort;
    }

    const col_name = `keyword_research_${projectId}`;
    await this.connection.model(col_name, KeywordSchema);
    const data = await this.connection
      .model(col_name)
      .find(_filters, { _id: false, __v: false })
      .sort({ priority: 1 })
      .collation({ locale: 'en_US', numericOrdering: true })
      .limit(11)
      .skip(Number(offset || 0))
      .exec();

    const maxPriorityScoreResult = (
      await this.connection
        .model<KeywordDocument>(col_name)
        .find()
        .sort({ priorityScore: -1 })
        .collation({ locale: 'en_US', numericOrdering: true })
        .limit(1)
        .exec()
    ).pop();
    const maxPriorityScore = maxPriorityScoreResult
      ? Number(maxPriorityScoreResult.priorityScore || 0)
      : 0;
    const count = await this.connection.model(col_name).find(_filters).count();
    return {
      count,
      data,
      maxPriorityScore,
    };
  }

  async updateRow(params, body): Promise<any> {
    const { projectId } = params;
    const _col_name = `keyword_research_${projectId}`;
    await this.connection.model(_col_name, KeywordSchema);
    return await this.connection
      .model(_col_name)
      .updateOne({ url: body.url }, { $set: body }, { upsert: true });
  }

  async saveCSV(body): Promise<any> {
    const project = new this.keywordModel({
      parent_category: body.Parent_Category,
      keyword: body.Keyword,
      search_volume: body.Search_Volume,
      cpc: body.CPC,
      matching_products_exact: body.matching_products_exact,
      matching_products_fuzzy: body.matching_products_fuzzy,
      similarity: body.Similarity,
      matched_category: body.Matched_Category,
      matched_category_page_title: body.Matched_Category_Page_Title
    });

    return project.save();
  }

  async getCSV () {
    return this.keywordModel.find()
  }
}
