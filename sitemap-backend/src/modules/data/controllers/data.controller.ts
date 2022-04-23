import { Controller, Get, Query, Req } from '@nestjs/common';
import { DataService } from '../services';
import { DataDocument } from '../schemas';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('top-performance')
  async getTopPerformance(
    @Query() params,
    @Req() req,
  ): Promise<{ data: DataDocument[]; count: number }> {
    const { projectId } = req.query;
    return await this.dataService.getTopPerformance(params, projectId);
  }

  @Get('clicks')
  async clicks(@Query() params, @Req() req) {
    const { projectId } = req.query;
    const response = {
      data: { x: [], clicks: [], impressions: [], positions: [] },
      info: {},
    };
    const { data, info } = await this.dataService.getClicks(params, projectId);
    data.forEach((row) => {
      response.data.x.push(row.date.toLocaleDateString());
      response.data.clicks.push(row.clicks);
      response.data.positions.push(Math.round(row.position));
      response.data.impressions.push(row.impressions);
    });
    response.info = info;
    return response;
  }

  @Get('keyword-ranking')
  async keywordRanking(@Query() params, @Req() req) {
    const { projectId } = req.query;
    return await this.dataService.getKeywordRanking(params, projectId);
  }

  @Get('revenue')
  async revenue(@Query() params) {
    const response = { x: [], revenue: [] };
    const organicResponse = { x: [], revenue: [] };
    const {
      result,
      total,
      organicResult,
      organicTotal,
    } = await this.dataService.getRevenuGraph(params);
    result.forEach((row) => {
      response.x.push(row.date.toLocaleDateString());
      response.revenue.push(row.revenue);
    });
    organicResult.forEach((row) => {
      organicResponse.x.push(row.date.toLocaleDateString());
      organicResponse.revenue.push(row.revenue);
    });
    return {
      result: response,
      organicResult: organicResponse,
      total,
      organicTotal,
    };
  }
}
