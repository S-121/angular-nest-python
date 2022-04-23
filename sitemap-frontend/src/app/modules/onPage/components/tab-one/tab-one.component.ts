import {
  Component,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import { debounce, searchSort } from 'src/app/shared';
import { AppService } from 'src/app/app.service';
import { KeywordService } from 'src/app/modules/keyword-research/services';

@Component({
  selector: 'app-tab-one',
  templateUrl: './tab-one.component.html',
  styleUrls: ['./tab-one.component.scss'],
})
export class TabOneComponent implements AfterViewInit {
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

  @Output() onUpdateItem: EventEmitter<any> = new EventEmitter();
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
    this.onUpdateItem.emit(item);
    // await this.__keywordService.updateRow(item);
    // if (fetch) {
    //   await this.getData(false, this.offset, this.pageSize, this.params);
    // }
  }
}
