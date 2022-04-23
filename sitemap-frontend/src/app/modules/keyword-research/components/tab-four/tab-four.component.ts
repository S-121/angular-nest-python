import { Component, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { KeywordService } from '../../services';
import { debounce, searchSort } from 'src/app/shared';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-tab-four',
  templateUrl: './tab-four.component.html',
  styleUrls: ['./tab-four.component.scss'],
})
export class TabFourComponent implements OnInit {
  error: string;
  isLoading = false;
  data: any[];
  header: any[];
  pageSize: number = 15;
  offset: number = 0;
  count: number = 11;
  refreshFn: Function;
  firstCall = true;

  constructor(
    private readonly __keywordService: KeywordService,
    private readonly __appService: AppService
  ) {
    this.refreshFn = debounce(this.refresh);
  }

  async getData(
    first = false,
    offset = this.offset,
    pageSize = this.pageSize,
    params = undefined
  ) {
    try {
      this.isLoading = true;
      const {
        data: [header, ...data],
        count,
      } = await this.__keywordService.getkeyword(3, offset, pageSize, params);
      if (first) {
        this.header = Object.values(header);
      }
      this.data = data;
      this.count = count;
      this.error = null;
    } catch ({ error }) {
      this.error = error.message || 'Server Error';
    } finally {
      this.isLoading = false;
    }
  }
  async ngOnInit(): Promise<void> {
    await this.getData(true);
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
    await this.getData(false, this.offset, this.pageSize, params);
  }
}
