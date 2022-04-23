import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { DashboardService } from '../../services';
import { ClrDatagridPagination, ClrDatagridStateInterface } from '@clr/angular';
import { debounce, searchSort } from 'src/app/shared';


@Component({
  selector: 'app-top-performing-pages',
  templateUrl: './top-performing-pages.component.html',
  styleUrls: ['./top-performing-pages.component.scss'],
})

export class TopPerformingPagesComponent implements OnInit {
  widget: any;
  selected = [];
  isLoading: boolean;
  refreshFn: Function;
  error: string;
  result: any;
  getDataFn: Function;
  searchKeyword: any;
  keywordData: any;
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
  count: number = 20;
  firstCall = true;
  response: Array<any> = [];
  retry = 0;
  @ViewChild('paginationSimple') pagination: ClrDatagridPagination;

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
        this.keywordData = this.result = data.map((item, index) => {
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
          this.keywordData = this.result = data;
      }
      this.isLoading = false;
      this.count = count;
      this.error = null;
      this.offset = offset;
    } catch (error) {
      this.error = error.message || 'Server Error';
    } finally {
      this.isLoading = false;
    }
    if(this.error && !this.retry) {
      this.retry = 1;
      this.getData(offset, pageSize, q);
    } else {
      this.retry = 0;
    }
  }
  async ngOnInit() {
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
    await this.getDataFn(state.page.size * (state.page.current - 1), this.pageSize, params);
  }

  async selectKeyword(evt, query, search_top_performing) {
    evt.stopPropagation();
    
    if (search_top_performing === 'url') {
      this.currentQuery = new URL(query).pathname;
    } else {
      this.currentQuery = query;
    }

    await this.getData(
      0,
      this.pageSize,
      JSON.stringify({ filters: { query } })
    );
    this.__dashboardService.keywordChanged.emit(query);
  }

  async removeQuery() {
    this.currentQuery = null;
    await this.getData(0, this.pageSize, null);
    this.__dashboardService.keywordChanged.emit('');
  }

  async filterKeywords() {

    if (typeof this.searchKeyword === 'undefined')
      return;

    let _this = this;
    this.keywordData = this.result;
    this.keywordData = this.keywordData.filter(function(data) {

      for (const property in data) {
        if (data.query.toLowerCase().includes(_this.searchKeyword)) {
              return true;
        }

        return false;
      }
    });
  }

  async showKeywordData() {
    this.searchKeyword = '';
    this.keywordData = this.result;
  }
}

// implements OnInit, AfterViewInit {
//   isLoading: boolean;
//   refreshFn: Function;
//   error: string;
//   result: any;
//   getDataFn: Function;
//   columns: string[] = [
//     'Keyword',
//     'Clicks',
//     'Impressions',
//     'CTR',
//     'Position',
//     'URL',
//   ];

//   currentQuery: string;
//   constructor(
//     private readonly __overviewService: OverviewService,
//     private readonly __appService: AppService
//   ) {
//     this.refreshFn = debounce(this.refresh);
//     this.getDataFn = debounce(this.getData);
//   }
//   ngAfterViewInit(): void {
//     const filters = document.querySelector('[shape="filter-grid"]');
//     if (filters) {
//       filters.setAttribute('shape', 'add');
//     }
//   }
//   pageSize: number = 10;
//   offset: number = 0;
//   count: number = 10;
//   firstCall = true;
//   async getData(offset = this.offset, pageSize = this.pageSize, q = null) {
//     try {
//       this.isLoading = true;
//       const { data, count } = await this.__overviewService.getTopPerformance(
//         offset,
//         pageSize,
//         q
//       );
//       this.result = data;
//       this.count = count;
//       this.isLoading = false;
//       this.error = null;
//     } catch ({ error }) {
//       this.error = error.message || 'Server Error';
//     } finally {
//       this.isLoading = false;
//     }
//   }
//   async ngOnInit(): Promise<void> {
//     this.__appService.changeProjct.subscribe(async () => {
//       this.currentQuery = null;
//       await this.getDataFn();
//     });
//   }

//   async refresh(state: ClrDatagridStateInterface) {
//     if (this.firstCall) {
//       this.firstCall = false;
//       return;
//     }
//     let params = searchSort(state);
//     if (this.currentQuery) {
//       const body = JSON.parse(params);
//       body.filters.$and.push({ query: this.currentQuery });
//       params = JSON.stringify(body);
//       console.log({ params });
//     }
//     this.offset = state.page.size * (state.page.current - 1);
//     await this.getDataFn(this.offset, this.pageSize, params);
//   }

//   async selectKeyword(evt, query) {
//     evt.stopPropagation();
//     this.currentQuery = query;
//     await this.getData(
//       0,
//       this.pageSize,
//       JSON.stringify({ filters: { query } })
//     );
//     this.__appService.keywordChanged.emit(query);
//   }

//   async removeQuery() {
//     this.currentQuery = null;
//     await this.getData(0, this.pageSize, null);
//     this.__appService.keywordChanged.emit('all');
//   }
// }
