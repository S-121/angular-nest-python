import { Controller, Get, Query, Body, Put } from '@nestjs/common';
import { WQAService } from '../services';
import { Public, CurrentUser } from 'src/modules/auth/constants';

@Controller('wqa')
export class WqaController {
  constructor(private readonly wQAService: WQAService) {}

  @Public()
  @Get('/')
  async getWqa(@Query() params): Promise<{ count: number; data: any[] }> {
    return this.wQAService.getWqa(params);
  }

  @Put('/update-row')
  async uploadRow(@Query() params, @Body() body): Promise<any> {
    return this.wQAService.updateRow(params, body);
  }

  @Put('/update-rows')
  async uploadRows(@Query() params, @Body() body): Promise<any> {
    return this.wQAService.updateRows(params, body);
  }

  @Put('/')
  async uploadSFCSV(
    @Body() body,
    @Query() params,
    @CurrentUser() user,
  ): Promise<any> {
    return this.wQAService.uploadSFCSV(body, params, user);
  }
}
