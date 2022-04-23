import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import { KeywordService } from '../../services';
import { debounce, searchSort } from 'src/app/shared';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-tab-three',
  templateUrl: './tab-three.component.html',
  styleUrls: ['./tab-three.component.scss'],
})
export class TabThreeComponent implements AfterViewInit {
  error: string;
  isLoading = false;
  data: any[];
  header: any[];
  pageSize: number = 15;
  offset: number = 0;
  count: number = 11;
  refreshFn: Function;
  updateItem: Function;
  firstCall = true;
  params = null;
  @ViewChild('datagridRef') datagrid: ClrDatagrid;

  constructor(
    private readonly __keywordService: KeywordService,
    private readonly __appService: AppService
  ) {
    this.refreshFn = debounce(this.refresh);
    this.updateItem = debounce(this.updateItemFn);
  }

  async getData(
    first = false,
    offset = this.offset,
    pageSize = this.pageSize,
    params = undefined
  ) {
    try {
      if (this.datagrid) {
        this.datagrid.dataChanged();
        this.datagrid.resize();
      }
      this.isLoading = true;
      const { data, count } = await this.__keywordService.getTargetkeyword(
        0,
        offset,
        pageSize,
        params
      );
      this.data = data;
      this.count = count;

      requestAnimationFrame(() => {
        if (this.datagrid) {
          this.datagrid.dataChanged();
          this.datagrid.resize();
        }
      });
      this.error = null;
    } catch ({ error }) {
      this.error = error.message || 'Server Error';
    } finally {
      this.isLoading = false;
    }
  }
  async ngAfterViewInit(): Promise<void> {
    await this.getData(true);
    this.__appService.changeProjct.subscribe(async () => {
      await this.getData();
    });
  }

  async refresh(state: ClrDatagridStateInterface) {
    this.params = searchSort(state);
    this.offset = state.page.size * (state.page.current - 1);
    await this.getData(false, this.offset, this.pageSize, this.params);
  }

  async updateItemFn(item, fetch = false) {
    await this.__keywordService.updateRow(item);
    if (fetch) {
      await this.getData(false, this.offset, this.pageSize, this.params);
    }
  }
}
