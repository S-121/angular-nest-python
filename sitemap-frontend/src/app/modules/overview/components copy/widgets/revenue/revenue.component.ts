import { Component, OnInit, EventEmitter } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../services';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss'],
})
export class RevenueComponent implements OnInit {
  widget: any;
  resizeSub: Subscription;
  resizeEvent: EventEmitter<GridsterItem>;
  isLoading = false;
  error: string;
  echartsInstance;
  result: Array<any> = [];

  options: any = {};
  constructor(private readonly __dashboardService: DashboardService) {}

  async getData() {
    try {
      this.isLoading = true;
      this.result = await this.__dashboardService.getRevenue();
      this.setOptions(this.result);
      requestAnimationFrame(() => {
        if (this.echartsInstance) {
          this.echartsInstance.resize();
        }
      });
      this.isLoading = false;
      this.error = null;
    } catch ({ error }) {
      this.error = error.message || 'Server Error';
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
        data: ['Organic Earnings', 'Total Earnings'],
      },
      series: [],
      grid: null,
    };
    if (result.length > 1) {
      this.options.grid = [{ bottom: '55%' }, { top: '55%' }];
    } else {
      this.options.grid = null;
    }

    result.forEach(({ result, organicResult }, index) => {
      this.options.xAxis.push({
        type: 'category',
        data: result.x,
        gridIndex: index,
      });
      this.options.yAxis.push({ gridIndex: index, type: 'value' });
      this.options.series = this.options.series.concat([
        {
          name: 'Organic Earnings',
          type: 'bar',
          barWidth: '60%',
          color: '#9b59b6',
          data: organicResult.revenue,
          xAxisIndex: index,
          yAxisIndex: index,
        },
        {
          name: 'Total Earnings',
          type: 'bar',
          barWidth: '60%',
          color: '#2980b9',
          data: result.revenue,
          xAxisIndex: index,
          yAxisIndex: index,
        },
      ]);
    });
  }
}
