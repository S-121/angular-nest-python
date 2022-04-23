import { Component, OnInit, EventEmitter } from '@angular/core';
import { DashboardService } from '../../../services';
import { Subscription } from 'rxjs';
import { GridsterItem } from 'angular-gridster2';

@Component({
  selector: 'app-keyword',
  templateUrl: './keyword.component.html',
  styleUrls: ['./keyword.component.scss'],
})
export class KeywordComponent implements OnInit {
  widget: any;
  resizeSub: Subscription;
  resizeEvent: EventEmitter<GridsterItem>;
  isLoading = false;
  info: any;
  error: string;
  echartsInstance;
  rows: Array<any> = [];
  options: any = {};
  constructor(private readonly __dashboardService: DashboardService) {}

  async getData() {
    try {
      this.isLoading = true;
      this.rows = await this.__dashboardService.getKeywordChart();
      this.error = null;
      this.setOptions(this.rows);
      requestAnimationFrame(() => {
        if (this.echartsInstance) {
          this.echartsInstance.resize();
        }
      });
      this.error = null;
    } catch (err) {
      const { error } = err;
      this.error = err || error.message || 'Server Error';
    } finally {
      this.isLoading = false;
    }
  }
  async ngOnInit() {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget.type === this.widget.type) {
        requestAnimationFrame(() => {
          if (this.echartsInstance) {
            this.echartsInstance.resize();
          }
        });
      }
    });
    await this.getData();
    this.__dashboardService.queryChanged.subscribe(async (_) => {
      await this.getData();
    });
  }
  async onChartInit(ec) {
    this.echartsInstance = ec;
  }

  setOptions(result) {
    this.options = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: [],
      yAxis: [],
      legend: {
        data: ['Clicks', 'Impressions'],
      },
      series: [],
      grid: null,
    };
    if (result.length > 1) {
      this.options.grid = [{ bottom: '55%' }, { top: '55%' }];
    } else {
      this.options.grid = null;
    }
    let yAxis = 0;
    result.forEach(({ data: res }, index) => {
      this.options.xAxis.push({
        type: 'category',
        data: res.x,
        gridIndex: index,
      });
      this.options.yAxis.push({
        gridIndex: index,
        type: 'value',
        name: 'Clicks',
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#9b59b6',
          },
        },
      });
      this.options.yAxis.push({
        gridIndex: index,
        type: 'value',
        name: 'Impressions',
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#2980b9',
          },
        },
      });
      this.options.series = this.options.series.concat([
        {
          name: 'Clicks',
          type: 'line',
          color: '#9b59b6',
          data: res.clicks,
          xAxisIndex: index,
          yAxisIndex: yAxis++,
        },
        {
          name: 'Impressions',
          color: '#0072a3',
          type: 'line',
          data: res.impressions,
          xAxisIndex: index,
          yAxisIndex: yAxis++,
        },
      ]);
    });
  }
}
