import { Controller, Get, Query, Req } from '@nestjs/common';
import { GAService } from '../services';

@Controller('ga')
export class GAController {
  constructor(private readonly gAService: GAService) {}

  @Get('user')
  async gaUser(@Query() params, @Req() req) {
    const { projectId } = req.query;
    return await this.gAService.gaUser(params, projectId);
  }

  @Get('landing-pages')
  async landingPages(@Query() params, @Req() req) {
    const { projectId } = req.query;
    return await this.gAService.getLandingPages(params, projectId);
  }

  @Get('performance')
  async performance(@Query() params, @Req() req) {
    const { projectId } = req.query;
    return await this.gAService.getPerformance(params, projectId);
  }

  @Get('organic-data')
  async organicSessions(@Query() params, @Req() req) {
    const { projectId } = req.query;
    return await this.gAService.getOrganicData(params, projectId);
  }

  @Get('performance-data')
  async performanceData(@Query() params, @Req() req) {
    const { projectId } = req.query;
    return await this.gAService.getPerformanceData(params, projectId);
  }
}
