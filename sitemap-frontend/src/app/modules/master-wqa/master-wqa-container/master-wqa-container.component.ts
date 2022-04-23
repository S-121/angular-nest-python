import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { debounce, searchSort } from 'src/app/shared';
import { AppService } from 'src/app/app.service';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import { MasterWqaService } from '../services/wqa.service';

@Component({
  selector: 'app-master-wqa-container',
  templateUrl: './master-wqa-container.component.html',
  styleUrls: ['./master-wqa-container.component.scss'],
})
export class MasterWqaContainerComponent implements AfterViewInit {
  project: any;
  error: string;
  isLoading = false;
  data: any[];
  pageSize: number = 50;
  offset: number = 0;
  count: number = 11;
  refreshFn: Function;
  firstCall = true;
  @ViewChild('datagridRef') datagrid: ClrDatagrid;
  urlActionsClasses = {
    'Leave As Is': 'one',
    'Update "On Page"': 'two',
    'Target w/ Links': 'three',
    '301': 'four',
    Canonicalize: 'five',
    'Block Crawl': 'six',
    'No Index': 'seven',
    'Content audit': 'eight',
  };

  constructor(
    private readonly __masterWqaService: MasterWqaService,
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
      if (this.datagrid) {
        this.datagrid.dataChanged();
        this.datagrid.resize();
      }
      this.isLoading = true;
      const { data, count } = await this.__masterWqaService.getMasterWqa(
        offset,
        pageSize,
        params
      );
      if (data && data.length) {
        this.data = data;
      }
      requestAnimationFrame(() => {
        if (this.datagrid) {
          this.datagrid.dataChanged();
          this.datagrid.resize();
        }
      });
      this.count = count;
      this.error = null;
    } catch (err) {
      const { error } = err;
      this.error = (error && error.message) || err;
    } finally {
      this.isLoading = false;
    }
  }

  async ngAfterViewInit(): Promise<void> {
    this.project = this.__appService.getProjectFromLocalStorage();
    await this.getData(true);
    this.__appService.changeProjct.subscribe(async () => {
      await this.getData();
    });
  }

  async refresh(state: ClrDatagridStateInterface) {
    // if (this.firstCall) {
    //   this.firstCall = false;
    //   return;
    // }
    const params = searchSort(state);
    this.offset = state.page.size * (state.page.current - 1);
    await this.getData(false, this.offset, this.pageSize, params);
  }

  loadCSV({ target: { files } }) {
    if (files && files[0]) {
      var FR = new FileReader();
      FR.onload = async (e) => {
        try {
          this.isLoading = true;
          await this.__masterWqaService.uploadCSV({
            csvFilename: files[0].name,
            csv: btoa(e.target.result as string),
          });
          await this.getData();
        } catch ({ error }) {
          this.error = error.message || 'Server Error';
        } finally {
          this.isLoading = false;
        }
      };
      FR.readAsBinaryString(files[0]);
    }
  }

  loadAhrefsCSV({ target: { files } }) {
    if (files && files[0]) {
      var FR = new FileReader();
      FR.onload = async (e) => {
        try {
          this.isLoading = true;
          await this.__masterWqaService.uploadAhrefsCSV({
            csvFilename: files[0].name,
            csv: btoa(e.target.result as string),
          });
          await this.getData();
        } catch ({ error }) {
          this.error = error.message || 'Server Error';
        } finally {
          this.isLoading = false;
        }
      };
      FR.readAsBinaryString(files[0]);
    }
  }

  async urlActionChange(item) {
    await this.__masterWqaService.updateRow(item);
  }

  getClass(item) {
    return { [this.urlActionsClasses[item.urlAction]]: true };
  }
}
