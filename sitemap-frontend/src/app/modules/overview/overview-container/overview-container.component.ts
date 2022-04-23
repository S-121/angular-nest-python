import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';

import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { dateUtil } from 'src/app/shared';
import { DashboardService, UrlHelper } from '../services';

@Component({
  selector: 'app-overview-container',
  templateUrl: './overview-container.component.html',
  styleUrls: ['./overview-container.component.scss'],
})
export class OverviewContainerComponent implements OnInit, AfterViewInit {
  filterForm: FormGroup;
  devices: Map<string, boolean> = new Map();
  dateRangeFilter: any = {
    name: 'dateRange',
    value: '',
  };

  keywordFilter: any = {
    name: 'query',
    value: '',
  };

  project: any;
  ranges = [
    {
      title: 'Please Select',
      value: -1,
    },
    {
      title: 'Last 30 Days',
      value: 1,
    },
    {
      title: 'Last 3 Months',
      value: 3,
    },
    {
      title: 'Last 6 Months',
      value: 6,
    },
    {
      title: 'Last 12 Months',
      value: 12,
    },
  ];
  constructor(
    private readonly __appService: AppService,
    private readonly __router: Router,
    private readonly __formBuilder: FormBuilder,
    private readonly __dashboardService: DashboardService
  ) {
    this.__dashboardService.filters.filterBar1 = [
      this.dateRangeFilter,
      this.keywordFilter,
    ];
    this.filterForm = this.__formBuilder.group(
      {
        startDate: [],
        endDate: [],
        range: [],
      },
      { validators: this.correctRange('startDate', 'endDate') }
    );
  }

  ngAfterViewInit() {
    this.__dashboardService.keywordChanged.subscribe((keyword) => {
      this.keywordFilter.value = keyword;
      this.apply();
    });
    this.range.setValue(this.ranges[0].value);
    this.rangeChange({ value: 1 });
    this.starDate.valueChanges.subscribe((_) => {
      this.range.setValue(-1);
      this.dateChange();
    });
    this.endDate.valueChanges.subscribe((_) => {
      this.range.setValue(-1);
      this.dateChange();
    });
  }

  get starDate(): FormControl {
    return this.filterForm.controls.startDate as FormControl;
  }

  get endDate(): FormControl {
    return this.filterForm.controls.endDate as FormControl;
  }

  get range(): FormControl {
    return this.filterForm.controls.range as FormControl;
  }

  dateChange(fire = false) {
    if (this.filterForm.valid && (this.range.value === -1 || fire)) {
      localStorage.setItem('startDate', String(+new Date(this.starDate.value)));
      localStorage.setItem('endDate', String(+new Date(this.endDate.value)));
      this.dateRangeFilter.value = `${this.endDate.value}-${this.starDate.value}`;
      this.apply();
    }
  }

  deviceFilterChange(evt, value) {
    evt.preventDefault();
    if (this.devices.has(value)) {
      this.devices.delete(value);
    } else {
      this.devices.set(value, true);
    }
    this.__dashboardService.filters = { filterBar1: [], filterBar2: [] };

    Array.from(this.devices.keys())
      .sort()
      .reverse()
      .forEach((device, index) => {
        this.__dashboardService.filters[`filterBar${index + 1}`] = [
          {
            name: 'device',
            value: device,
          },
          this.dateRangeFilter,
          this.keywordFilter,
        ];
      });

    this.apply();
  }
  apply() {
    this.__dashboardService.query = UrlHelper.buildQuery(
      this.__dashboardService.filters
    );
    this.__dashboardService.debouncer.next(true);
  }
  rangeChange(range = null) {
    const { value } = range || this.range;
    if (value == -1) return;
    const endDate = new Date(),
      startDate = new Date();
    endDate.setMonth(endDate.getMonth() - value);
    const startDateStr = dateUtil(+startDate);
    const endDateStr = dateUtil(+endDate);
    this.filterForm.patchValue({
      startDate: startDateStr,
      endDate: endDateStr,
    });
    if (!range) {
      this.range.setValue(value);
    }
    this.dateChange(true);
  }

  maxDate() {
    const date = new Date().toLocaleDateString().split('/');
    return date[2] + '-' + date[0] + '-' + date[1];
  }

  checkIfEnabled() {
    this.project = this.__appService.getProjectFromLocalStorage();
    if (!this.project || !this.project.gsc) {
      this.__router.navigate(['/main/projects']);
    }
  }
  ngOnInit(): void {
    this.checkIfEnabled();
    this.__appService.changeProjct.subscribe((_) => {
      this.checkIfEnabled();
    });
  }

  correctRange(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const startDate = formGroup.controls[controlName];
      const endDate = formGroup.controls[matchingControlName];
      if (endDate.errors && !endDate.errors.correctRange) {
        return;
      }
      if (+new Date(startDate.value) < +new Date(endDate.value)) {
        endDate.setErrors({ correctRange: true });
      } else {
        endDate.setErrors(null);
      }
    };
  }
}
