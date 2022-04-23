import { Controller, Get, Query, Body, Put } from '@nestjs/common';
import { CWBService } from '../services';

@Controller('cwb')
export class CWBController {
  constructor(private readonly cwbService: CWBService) {}

  @Get('/settings')
  async getSettings(@Query() params): Promise<any> {
    return this.cwbService.getSettings(params);
  }

  @Put('/update-settings')
  async uploadSettings(@Query() params, @Body() body): Promise<any> {
    return this.cwbService.updateSettings(params, body);
  }

  @Get('/')
  async getQueue(@Query() params): Promise<{ count: number; data: any[] }> {
    return this.cwbService.getQueue(params);
  }

  @Get('/published')
  async getPublished(@Query() params): Promise<{ count: number; data: any[] }> {
    return this.cwbService.getPublished(params);
  }

  @Get('/disapproved')
  async getDisapproved(
    @Query() params,
  ): Promise<{ count: number; data: any[] }> {
    return this.cwbService.getDisapproved(params);
  }
  @Put('/update-rows')
  async uploadRow(@Query() params, @Body() body): Promise<any> {
    return this.cwbService.updateRows(params, body);
  }
}
