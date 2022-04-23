import { Component, OnInit } from '@angular/core';
import { GaService } from 'src/app/modules/googleanalytics/services';
import { ClrDatagridStateInterface } from '@clr/angular';
import { AppService } from 'src/app/app.service';
import { searchSort, debounce } from 'src/app/shared';

@Component({
  selector: 'app-landing-pages',
  templateUrl: './landing-pages.component.html',
  styleUrls: ['./landing-pages.component.scss'],
})
export class LandingPagesComponent implements OnInit {
  isLoading: boolean;
  result: any;
  refreshFn: Function;
  error: string;
  isNan = isNaN;
  constructor(
    private readonly __gaService: GaService,
    private readonly __appService: AppService
  ) {
    this.refreshFn = debounce(this.refresh);
  }
  pageSize: number = 10;
  offset: number = 0;
  count: number = 10;
  firstCall = true;
  async getData(offset = this.offset, pageSize = this.pageSize, q = null) {
    try {
      this.isLoading = true;
      const { data, count } = await this.__gaService.getLandingPages(
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
