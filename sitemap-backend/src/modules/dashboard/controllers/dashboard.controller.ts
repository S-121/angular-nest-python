import { Controller, Get, Query, Req } from '@nestjs/common';
import { DashboardService } from '../services';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('revenue')
  async revenue(@Query() params, @Req() req) {
    const rows = await this.dashboardService.getRevenu(params, req);
    const output = [];
    rows.forEach(({ result, organicResult, total, organicTotal, conversion_type }) => {
      const response = { x: [], revenue: [] };
      const organicResponse = { x: [], revenue: [] };
      result.forEach((row) => {
        response.x.push(new Date(row.date).toLocaleDateString());
        response.revenue.push(row.revenue);
      });
      organicResult.forEach((row) => {
        organicResponse.x.push(new Date(row.date).toLocaleDateString());
        organicResponse.revenue.push(row.revenue);
      });
      output.push({
        result: response,
        organicResult: organicResponse,
        total,
        organicTotal,
        conversion_type,
      });
    });

    return output;
  }

  @Get('keyword-chart')
  async keywordChart(@Query() params, @Req() req) {
    const rows = await this.dashboardService.getKeywordChart(params, req);
    return rows.map(({ data, info }) => {
      const response = {
        data: { x: [], clicks: [], impressions: [], positions: [] },
        info: {},
      };
      data.forEach((row) => {
        let date = new Date(row.date);
        let add_date = date.setDate(date.getDate() + 1);
        response.data.x.push(new Date(add_date).toLocaleDateString());
        response.data.clicks.push(row.clicks);
        response.data.positions.push(Math.round(row.position));
        response.data.impressions.push(row.impressions);
      });
      response.info = info;
      return response;
    });
  }

  @Get('top-performing')
  async topPerforming(@Query() params, @Req() req) {
    return await this.dashboardService.getTopPerforming(params, req);
  }
}
