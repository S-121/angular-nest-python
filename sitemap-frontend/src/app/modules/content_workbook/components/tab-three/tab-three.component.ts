import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { ContentWorkbookService } from '../../services/content_workbook.service';
import { SETTINGS_PROPORTIES } from '../../services';

@Component({
  selector: 'app-tab-three',
  templateUrl: './tab-three.component.html',
  styleUrls: ['./tab-three.component.scss'],
})
export class TabThreeComponent implements AfterViewInit {
  error: string;
  isLoading = false;
  success: boolean;
  @ViewChild('datagridRef') datagrid: ClrDatagrid;
  settings: Array<any> = [];

  config: any = [];
  constructor(
    private readonly __contentWorkbookService: ContentWorkbookService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.settings = await this.__contentWorkbookService.getSettings();
    this.config.push({
      property: SETTINGS_PROPORTIES.STATUS,
      options: this.getOptions(SETTINGS_PROPORTIES.STATUS),
    });
    this.config.push({
      property: SETTINGS_PROPORTIES.CONTENT_TYPE,
      options: this.getOptions(SETTINGS_PROPORTIES.CONTENT_TYPE),
    });
    // this.config.push({
    //   property: SETTINGS_PROPORTIES.CONTENT_TACTIC,
    //   options: this.getOptions(SETTINGS_PROPORTIES.CONTENT_TACTIC),
    // });
    this.config.push({
      property: SETTINGS_PROPORTIES.AUTHOR,
      options: this.getOptions(SETTINGS_PROPORTIES.AUTHOR),
    });
    this.config.push({
      property: SETTINGS_PROPORTIES.PILLAR,
      options: this.getOptions(SETTINGS_PROPORTIES.PILLAR),
    });
    this.config.push({
      property: SETTINGS_PROPORTIES.CLUSTER,
      options: this.getOptions(SETTINGS_PROPORTIES.CLUSTER),
    });
  }

  async onSave({ property, options }) {
    try {
      this.isLoading = true;
      this.success = false;
      await this.__contentWorkbookService.updateSettings({
        property,
        options: JSON.stringify(options),
      });
      this.error = null;
      this.success = true;
    } catch ({ error }) {
      this.error = error.message || 'Server Error';
      this.success = false;
    } finally {
      this.isLoading = false;
    }
  }

  getOptions(property) {
    return JSON.parse(
      this.settings.find((item) => item.property === property)?.options || '[]'
    );
  }
}
