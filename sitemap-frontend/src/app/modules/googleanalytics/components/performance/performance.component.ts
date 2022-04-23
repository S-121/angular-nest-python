import { Component, OnInit } from '@angular/core';
import { GaService } from '../../services';
import { AppService } from 'src/app/app.service';
import { debounce, searchSort } from 'src/app/shared';
import { ClrDatagridStateInterface } from '@clr/angular';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss'],
})
export class PerformanceComponent implements OnInit {
  isLoading: boolean;
  result: any;
  error: string;
  pageSize: number = 20;
  offset: number = 0;
  count: number = 10;
  refreshFn: Function;
  device : string = 'desktop';
  firstCall = true;
  constructor(
    private readonly __gaService: GaService,
    private readonly __appService: AppService
  ) {
    this.refreshFn = debounce(this.refresh);
  }

  async getData(offset = this.offset, pageSize = this.pageSize, params = '{}') {
    try {
      this.isLoading = true;
      params = this.getFilters(params)
      const { data, count } = await this.__gaService.getPerformance(
        offset,
        pageSize,
        params
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

  private getFilters(params: string) {
    const data = JSON.parse(params)
    if(!data.filters){
      data.filters = {}
    }
    if(!data.sort){
      data.sort = {}
    }
    data.filters.device = this.device;
    data.sort.url = 1;
    return JSON.stringify(data)
  }
  async ngOnInit(): Promise<void> {
    await this.getData();
    this.__appService.changeProjct.subscribe(async () => {
      await this.getData();
    });
  }

  public changeDevice(type: string) {
    this.device = type;
    this.getData()
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

  getClsClass(value) {
    value = String(value).trim().split(/\s{1}/).shift();
    const val = Number(value);
    if (val <= 0.1) {
      return 'good';
    } else if (val <= 0.25) {
      return 'normal';
    } else {
      return 'poor';
    }
  }

  getLcpClass(value) {
    value = String(value).trim().split(/\s{1}/).shift();
    const val = Number(value);
    if (val <= 2.5) {
      return 'good';
    } else if (val <= 4.0) {
      return 'normal';
    } else {
      return 'poor';
    }
  }

  getTbtClass(value) {
    value = String(value).trim().split(/\s{1}/).shift();
    const val = Number(value);
    if (val <= 100) {
      return 'good';
    } else if (val <= 300) {
      return 'normal';
    } else {
      return 'poor';
    }
  }
}
