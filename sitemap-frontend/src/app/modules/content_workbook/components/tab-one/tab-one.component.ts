import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import { v4 as uuidv4 } from 'uuid';
import { debounce, searchSort } from 'src/app/shared';
import { AppService } from 'src/app/app.service';
import { ContentWorkbookService, SETTINGS_PROPORTIES } from '../../services';

@Component({
  selector: 'app-tab-one',
  templateUrl: './tab-one.component.html',
  styleUrls: ['./tab-one.component.scss'],
})
export class TabOneComponent implements AfterViewInit {
  error: string;
  isLoading = false;
  selected = [];
  data: any[] = [];
  refreshFn: Function;
  updateItem: Function;
  params = null;
  success: boolean;
  @ViewChild('datagridRef') datagrid: ClrDatagrid;
  settings: Array<any> = [];
  dropDownLists: { [key: string]: any } = {
    pillar: null,
    author: null,
    contentTactic: null,
    contentType: null,
    status: null,
    cluster: null,
  };
  priorityClasses = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
  };

  constructor(
    public readonly __contentWorkbookService: ContentWorkbookService,
    private readonly __appService: AppService
  ) {
    this.refreshFn = debounce(this.refresh);
    this.updateItem = debounce(this.updateItemFn);
  }

  filter(data) {
    return data.filter((item) => !item.published && !item.disapproved);
  }
  async getData(params = undefined) {
    try {
      if (this.datagrid) {
        this.datagrid.dataChanged();
        this.datagrid.resize();
      }
      this.isLoading = true;
      const { data, count } = await this.__contentWorkbookService.getQueue(
        params
      );
      this.data = data;
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
    this.settings = await this.__contentWorkbookService.getSettings();
    this.__contentWorkbookService.saveItems.subscribe(() => {
      this.save();
      this.__contentWorkbookService.subject.next(true);
    });
    this.populateDropDownLists();
    await this.getData(true);
    this.__appService.changeProjct.subscribe(async () => {
      await this.getData();
    });
  }

  async refresh(state: ClrDatagridStateInterface) {
    this.params = searchSort(state);
    await this.getData(this.params);
  }

  getClass(item) {
    return { [this.priorityClasses[item.priority]]: true };
  }

  async updateItemFn(item, fetch = false) {
    this.__contentWorkbookService.dirty = true;
    // await this.__contentWorkbookService.updateRow(item);
    // if (fetch) {
    //   await this.getData(false, this.offset, this.pageSize, this.params);
    // }
  }

  onAdd() {
    this.data.push({ id: uuidv4(), value: '' });
    this.__contentWorkbookService.dirty = true;
  }

  onDelete() {
    this.data = this.data.filter((item) => !this.selected.includes(item));
    this.__contentWorkbookService.dirty = true;
  }

  async save() {
    try {
      this.isLoading = true;
      await this.__contentWorkbookService.updateRows(this.data);
      this.__contentWorkbookService.subject.next(true);
      this.error = null;
      this.success = true;
      setTimeout(() => (this.success = false), 2000);
      await this.getData();
    } catch ({ error }) {
      this.success = false;
      this.error = error.message || 'Server Error';
    } finally {
      this.isLoading = false;
      this.__contentWorkbookService.dirty = false;
    }
  }

  populateDropDownLists() {
    this.dropDownLists['status'] = this.getOptions(SETTINGS_PROPORTIES.STATUS);
    this.dropDownLists['contentType'] = this.getOptions(
      SETTINGS_PROPORTIES.CONTENT_TYPE
    );
    this.dropDownLists['contentTactic'] = this.getOptions(
      SETTINGS_PROPORTIES.CONTENT_TACTIC
    );
    this.dropDownLists['author'] = this.getOptions(SETTINGS_PROPORTIES.AUTHOR);
    this.dropDownLists['cluster'] = this.getOptions(
      SETTINGS_PROPORTIES.CLUSTER
    );
    this.dropDownLists['pillar'] = this.getOptions(SETTINGS_PROPORTIES.PILLAR);
    console.log({ dropDownLists: this.dropDownLists });
  }
  getOptions(property) {
    return JSON.parse(
      this.settings.find((item) => item.property === property)?.options || '[]'
    );
  }

  getValueByIdFromArray(arr, id) {
    return arr.find((item) => item.id === id)?.value;
  }
}
