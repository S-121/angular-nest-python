import { Component, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { debounce, searchSort } from 'src/app/shared';
import { AppService } from 'src/app/app.service';
import { KeywordService } from 'src/app/modules/keyword-research/services';

@Component({
  selector: 'app-tab-one',
  templateUrl: './tab-one.component.html',
  styleUrls: ['./tab-one.component.scss'],
})
export class TabOneComponent implements OnInit {
  isLoading: boolean;
  params: string;
  error: string;
  result: any;
  absFn = Math.abs;

  filter: string;
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
    this.params = searchSort(state);

    const params = this.params
      ? JSON.parse(this.params)
      : { sort: {}, filters: { $and: [{}] } };
    if (this.filter) {
      params.filters.$and.push({
        device: this.filter,
      });
    }
    this.offset = state.page.size * (state.page.current - 1);
    await this.getData(this.offset, this.pageSize, JSON.stringify(params));
  }

  async selectFilterType(filter) {
    if (this.filter === filter) {
      this.filter = null;
    } else {
      this.filter = filter;
    }
    const params = this.params
      ? JSON.parse(this.params)
      : { sort: {}, filters: { $and: [{}] } };
    if (this.filter) {
      params.filters.$and.push({
        device: this.filter,
      });
    }
    if (this.filter !== null)
    await this.getData(this.offset, this.pageSize, JSON.stringify(params));
  }
}
