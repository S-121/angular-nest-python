import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import { v4 as uuidv4 } from 'uuid';
import { debounce, searchSort } from 'src/app/shared';
import { AppService } from 'src/app/app.service';
import { ContentWorkbookService, SETTINGS_PROPORTIES } from '../../services';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tab-four',
  templateUrl: './tab-four.component.html',
  styleUrls: ['./tab-four.component.scss'],
})
export class TabFourComponent implements AfterViewInit {
  dirty = false;
  error: string;
  isLoading = false;
  selected = [];
  data: any[] = [];
  refreshFn: Function;
  params = null;
  success: boolean;
  subject: Subject<boolean> = new Subject();
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
    private readonly __contentWorkbookService: ContentWorkbookService,
    private readonly __appService: AppService
  ) {
    this.refreshFn = debounce(this.refresh);
  }

  async getData(params = undefined) {
    try {
      if (this.datagrid) {
        this.datagrid.dataChanged();
        this.datagrid.resize();
      }
      this.isLoading = true;
      const {
        data,
        count,
      } = await this.__contentWorkbookService.getDisapproved(params);
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
