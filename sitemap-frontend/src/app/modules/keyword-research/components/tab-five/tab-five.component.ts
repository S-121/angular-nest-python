import { Component, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { KeywordService } from '../../services';
import { debounce, searchSort } from 'src/app/shared';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-tab-five',
  templateUrl: './tab-five.component.html',
  styleUrls: ['./tab-five.component.scss'],
})
export class TabFiveComponent implements OnInit {
  isLoading: boolean;
  error: string;
  result: any;
  absFn = Math.abs;

  numberFn = Number;
  refreshFn: Function;
  firstCall = true;
  columns: string[] = [
    'Keyword',
    'Clicks',
    'Impressions',
    'CTR',
    'Position',
    'URL',
  ];

  constructor(
    private readonly __keywordService: KeywordService,
    private readonly __appService: AppService
  ) {
    this.refreshFn = debounce(this.refresh);
  }
  pageSize: number = 20;
  offset: number = 0;
  count: number = 10;

  async getData(offset = this.offset, pageSize = this.pageSize, q = null) {
    try {
      this.isLoading = true;
      const { data, count } = await this.__keywordService.getKeywordRanking(
        offset,
        pageSize,
        q
      );
      this.result = data;
      this.count = count;
      this.isLoading = false;
      this.error = null;
    } catch ({ error }) {
      this.error = error.message || 'Server Error';
    } finally {
      this.isLoading = false;
    }
  }
  async ngOnInit(): Promise<void> {
    await this.getData();
    this.__appService.changeProjct.subscribe(async () => {
      await this.getData();
    });
  }

  async refresh(state: ClrDatagridStateInterface) {
    if (this.firstCall) {
      this.firstCall = false;
      return;
    }
    const params = searchSort(state);
    this.offset = state.page.size * (state.page.current - 1);
    await this.getData(this.offset, this.pageSize, params);
  }
}
