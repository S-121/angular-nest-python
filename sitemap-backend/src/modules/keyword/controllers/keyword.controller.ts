import { Controller, Get, Query, Put, Body, Post } from '@nestjs/common';
import { KeywordService } from '../services';
import { Public } from 'src/modules/auth/constants';

@Controller('keyword')
export class Keywordcontroller {
  constructor(private readonly keywordService: KeywordService) {}
  
  @Public()
  @Post('/csv-save')
  async csvSave(@Body() data) {
    const result = await this.keywordService.saveCSV(data);
    return result
  }
  
  @Public()
  @Get('/get-csv')
  async get_CSV() {
    return await this.keywordService.getCSV();
  }

  @Public()
  @Get('/')
  async getKeywords(
    @Query() params,
  ): Promise<{ count: number; data: any[]; maxPriorityScore: number }> {
    return this.keywordService.getKeyword(params);
  }

  @Public()
  @Get('/target')
  async getTargetKeywords(
    @Query() params,
  ): Promise<{ count: number; data: any[] }> {
    return this.keywordService.getTargetKeyword(params);
  }

  @Put('/update-row')
  async uploadRow(@Query() params, @Body() body): Promise<any> {
    return this.keywordService.updateRow(params, body);
  }
}
