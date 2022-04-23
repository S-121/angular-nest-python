import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { WQASchema, WQADocument } from '../schemas';
import * as parse from 'csv-parse/lib/sync';
import { getImpressions, getGAData, getKeywords, getVolume } from 'src/scripts';
import { ProjectService } from 'src/modules/project';
import { KeywordSchema } from 'src/modules/keyword/schemas';

@Injectable()
export class WQAService {
  oauth2Client: any;

  constructor(
    @InjectConnection() private connection: Connection,
    private readonly projectService: ProjectService,
  ) {}

  async updateRow(params, body): Promise<any> {
    const { projectId } = params;
    const col_name = `master_quality_${projectId}`;
    await this.connection.model(col_name, WQASchema);

    const _col_name = `keyword_research_${projectId}`;
    await this.connection.model(_col_name, KeywordSchema);

    const row = await this.connection
      .model(_col_name)
      .findOne({ url: body.url });
    if (
      ['Update "On Page"', 'Target w/ Links', 'Content audit'].includes(
        body.urlAction,
      )
    ) {
      await this.connection
        .model(_col_name)
        .updateOne({ url: body.url }, { $set: body }, { upsert: true });
    } else if (row) {
      await row.delete();
    }
    return await this.connection
      .model(col_name)
      .updateOne({ url: body.url }, body);
  }

  async updateRows(params, body): Promise<any> {
    const { projectId } = params;
    const _col_name = `keyword_research_${projectId}`;
    await this.connection.model(_col_name, KeywordSchema);

    const rows = body.rows.map((row) =>
      this.connection
        .model(_col_name)
        .updateOne({ url: row.url }, { $set: row }),
    );
    return await Promise.all(rows);
  }

  async getWqa(params): Promise<{ count: number; data: any[] }> {
    const { projectId, offset, query } = params;
    let _filters, _sort;
    if (query) {
      const { sort, filters } = JSON.parse(query);
      _filters = filters;
      _sort = sort;
    }
    const col_name = `master_quality_${projectId}`;
    await this.connection.model(col_name, WQASchema);
    const data = await this.connection
      .model(col_name)
      .find(_filters, { _id: false, __v: false })
      .sort(_sort)
      .collation({ locale: 'en_US', numericOrdering: true })
      .limit(50)
      .skip(Number(offset || 0))
      .exec();
    const count = await this.connection.model(col_name).find(_filters).count();
    return { count, data };
  }

  async uploadSFCSV(body, params, user): Promise<any> {
    const { projectId } = params;
    const { csv } = body;
    if (csv) {
      await this.saveSFCSV(projectId, csv, user, projectId);
      delete body.csv;
    }
  }

  async saveSFCSV(id, csv, user, projectId) {
    const { viewId, url } = await this.projectService.getProjectById(projectId);
    const collectionName = `master_quality_${id}`;
    const rows = parse(Buffer.from(csv, 'base64').toString().trim(), {
      columns: true,
      skip_empty_lines: true,
    });
    let filteredRows = rows.map((row) => {
      const {
        Address: url,
        'Status Code': statusCode,
        'Content Type': type,
        'Title 1': contentTitle,
        'Meta Description 1': meta,
        'H1-1': h1,
        'Word Count': wordCount,
        'Canonical Link Element 1': connicalLinkelement,
        Inlinks: inlinks,
        Outlinks: outlinks,
        'Last Modified': lastModified,
        Indexability: indexNonIndex,
      } = row;
      return {
        url,
        statusCode,
        type,
        contentTitle,
        meta,
        h1,
        wordCount,
        connicalLinkelement,
        inlinks,
        outlinks,
        lastModified,
        indexNonIndex,
        urlAction: 'Leave As Is',
        category:
          String(url).indexOf('collections') >= 0
            ? 'Product Category'
            : 'Product Page',
      };
    });
    const impressions = await getImpressions(
      user,
      viewId,
      url,
      filteredRows.map((item) => item.url),
    );

    const gaData = await getGAData(user, viewId);
    filteredRows = filteredRows.map((row) => {
      const item = impressions.find((imp) => imp.url === row.url);
      const { hostname, protocol } = new URL(row.url);
      const basePath = `${protocol}//${hostname}`;
      const gaItem = gaData.find(
        (_gaItem) => `${basePath}${_gaItem.page}` === row.url,
      );
      row.impressions = item ? item.impressions : 0;
      row.ctr = item ? item.ctr : 0;
      row = { ...row, ...gaItem };
      return row;
    });
    try {
      const _col_name = `keyword_research_${projectId}`;
      await this.connection.model(_col_name, KeywordSchema);

      await this.connection.model(collectionName, WQASchema);
      await this.connection.dropCollection(collectionName);
      await this.connection.dropCollection(_col_name);
    } catch (err) {
    } finally {
      await this.connection.model(collectionName).remove({});
      await this.connection.model(collectionName, WQASchema);
      await this.connection.createCollection(collectionName);
      await this.connection.model(collectionName).insertMany(filteredRows);
      const keywords = await getKeywords(user, viewId, url);
      await this.setKeywords(keywords, projectId);
    }
  }

  async setKeywords(keywords, projectId): Promise<any> {
    let k = new Set();
    const collectionName = `master_quality_${projectId}`;
    const dbData = await this.connection
      .model<WQADocument>(collectionName)
      .find({})
      .exec();

    const pagesKws = this.groupBy(keywords, 'page');
    for (let page in pagesKws) {
      const row = dbData.find((_row) => _row.url === page);
      if (row) {
        let keywords = pagesKws[page];
        const main = [...keywords]
          .sort((a, b) => Number(b.clicks) - Number(a.clicks))
          .shift();
        row.mainKw = main.keyword;
        k.add(main.keyword);
        row.mainKwPosition = String(Math.round(main.position));
        //row.mainKwVolume = main.volume;
        const best = [...keywords]
          .sort((a, b) => parseFloat(b.best) - parseFloat(a.best))
          .shift();
        row.bestKw = best.keyword;
        k.add(best.keyword);
        row.bestKwPosition = String(Math.round(best.position));
        //row.bestKwVolume = best.volume;

        await row.save();
      }
    }
    const keywordsArray = [...k];
    const promises = [];
    const chunk = 100;
    for (let i = 0, j = keywordsArray.length; i < j; i += chunk) {
      promises.push(getVolume(keywordsArray.slice(i, i + chunk)));
    }

    let volumes = await Promise.all(promises);
    volumes = volumes
      .reduce((acc, val) => acc.concat(val), [])
      .map((item) => ({ keyword: item.keyword, volume: item.vol }));
    for (let i = 0; i < volumes.length; i++) {
      const volume = volumes[i];
      await this.connection.model<WQADocument>(collectionName).update(
        {
          mainKw: volume.keyword,
        },
        {
          $set: {
            mainKwVolume: volume.volume,
          },
        },
      );
      await this.connection.model<WQADocument>(collectionName).update(
        {
          bestKw: volume.keyword,
        },
        {
          $set: {
            bestKwVolume: volume.volume,
          },
        },
      );
    }
    return volumes;
  }

  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
}
