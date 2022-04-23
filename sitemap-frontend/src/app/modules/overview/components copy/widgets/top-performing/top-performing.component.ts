import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import { debounce, searchSort } from 'src/app/shared';
import { DashboardService } from '../../../services';
import { Subscription } from 'rxjs';
import { GridsterItem } from 'angular-gridster2';

@Component({
  selector: 'app-top-performing',
  templateUrl: './top-performing.component.html',
  styleUrls: ['./top-performing.component.scss'],
})
export class TopPerformingComponent implements OnInit {
  widget: any;
  resizeSub: Subscription;
  resizeEvent: EventEmitter<GridsterItem>;
  selected = [];
  isLoading: boolean;
  refreshFn: Function;
  error: string;
  result: any;
  getDataFn: Function;
  columns: string[] = [
    'Keyword',
    'Clicks',
    'Impressions',
    'CTR',
    'Position',
    'URL',
  ];

  currentQuery: string;
  constructor(private readonly __dashboardService: DashboardService) {
    this.refreshFn = debounce(this.refresh);
    this.getDataFn = debounce(this.getData);
  }

  pageSize: number = 50;
  offset: number = 0;
  count: number = 1000;
  firstCall = true;
  response: Array<any> = [];
  async getData(offset = this.offset, pageSize = this.pageSize, q = null) {
    try {
      this.isLoading = true;
      this.response = await this.__dashboardService.getTopPerformance(
        offset,
        pageSize,
        q
      );
      const [{ data, count }] = this.response;
      if (this.response.length === 2) {
        const [, { data: secondData }] = this.response;
        this.result = data.map((item, index) => {
          return {
            clicks1: item.clicks,
            query1: item.query,
            position1: item.position,
            ctr1: item.ctr,
            impressions1: item.impressions,
            url1: item.url,
            clicks2: secondData[index].clicks,
            query2: secondData[index].query,
            position2: secondData[index].position,
            ctr2: secondData[index].ctr,
            impressions2: secondData[index].impressions,
            url2: secondData[index].url,
          };
        });
      } else {
        this.result = data;
      }
      this.count = count;
      this.isLoading = false;
      this.error = null;
    } catch ({ error }) {
      this.error = error.message || 'Server Error';
    } finally {
      this.isLoading = false;
    }
  }
  async ngOnInit() {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      console.log({ widget });
    });
    await this.getData();
    this.__dashboardService.queryChanged.subscribe(async (_) => {
      await this.getData();
    });
  }
  async refresh(state: ClrDatagridStateInterface) {
    if (this.firstCall) {
      this.firstCall = false;
      return;
    }
    let params = searchSort(state);
    if (this.currentQuery) {
      const body = JSON.parse(params);
      body.filters.$and.push({ query: this.currentQuery });
      params = JSON.stringify(body);
    }
    this.offset = state.page.size * (state.page.current - 1);
    await this.getDataFn(this.offset, this.pageSize, params);
  }
}
