import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services';

@Component({
  selector: 'app-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss'],
})
export class OverviewChartComponent implements OnInit {
  widget: any;
  isLoading = false;
  info: any;
  error: string;
  echartsInstance;
  rows: Array<any> = [];
  options: any = {};
  currentQuery: string;

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
    this.__dashboardService.keywordChanged.subscribe(async (keyword) => {
      if (keyword) {
        this.currentQuery = keyword;
      } else {
        this.currentQuery = null;
      }
    });

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

// implements OnInit {
//   isLoading = false;
//   info: any;
//   error: string;
//   echartsInstance;
//   currentQuery: string;

//   options = {
//     responsive: true,
//     tooltip: {
//       trigger: 'axis',
//       axisPointer: {
//         type: 'cross',
//         label: {
//           backgroundColor: '#6a7985',
//         },
//       },
//     },
//     xAxis: [
//       {
//         type: 'category',
//         boundaryGap: false,
//         data: [],
//       },
//     ],
//     yAxis: [
//       {
//         type: 'value',
//       },
//     ],
//   };
//   merge;
//   constructor(
//     private readonly __overviewService: OverviewService,
//     private readonly __appService: AppService
//   ) {}

//   async getData(keyword = 'all') {
//     try {
//       this.isLoading = true;
//       const { data, info } = await this.__overviewService.loadusergraph(
//         keyword
//       );
//       this.info = info;
//       this.error = null;
//       this.setOptions(data);
//       this.error = null;
//     } catch ({ error }) {
//       this.error = error.message || 'Server Error';
//     } finally {
//       this.isLoading = false;
//     }
//   }
//   async ngOnInit() {
//     this.__appService.changeProjct.subscribe(async () => {
//       await this.getData();
//     });
//     this.__appService.keywordChanged.subscribe(async (keyword) => {
//       if (keyword !== 'all') {
//         this.currentQuery = keyword;
//       } else {
//         this.currentQuery = null;
//       }
//       await this.getData(keyword);
//     });
//   }
//   async onChartInit(ec) {
//     this.echartsInstance = ec;
//   }
//   setOptions(res) {
//     this.merge = {
//       tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//           type: 'cross',
//         },
//       },
//       grid: {
//         right: '20%',
//       },
//       xAxis: [
//         {
//           type: 'category',
//           boundaryGap: false,
//           data: res.x,
//         },
//       ],
//       yAxis: [
//         {
//           type: 'value',
//           name: 'Clicks',
//           position: 'left',
//           axisLine: {
//             show: true,
//             lineStyle: {
//               color: '#9b59b6',
//             },
//           },
//         },
//         {
//           type: 'value',
//           name: 'Impressions',
//           position: 'right',
//           axisLine: {
//             show: true,
//             lineStyle: {
//               color: '#2980b9',
//             },
//           },
//         },
//         // {
//         //   type: 'value',
//         //   name: 'Position',
//         //   position: 'right',
//         //   offset: 80,
//         //   axisLine: {
//         //     show: true,
//         //     lineStyle: {
//         //       color: '#2c3e50',
//         //     },
//         //   },
//         // },
//       ],
//       legend: {
//         selected: {
//           Clicks: true,
//           Impressions: true,
//           Position: false,
//         },
//         data: ['Clicks', 'Impressions'],
//       },
//       series: [
//         {
//           name: 'Clicks',
//           type: 'line',
//           color: '#9b59b6',
//           data: res.clicks,
//         },
//         {
//           name: 'Impressions',
//           yAxisIndex: 1,
//           color: '#0072a3',
//           type: 'line',
//           data: res.impressions,
//         },
//         // {
//         //   name: 'Position',
//         //   color: '#2c3e50',
//         //   yAxisIndex: 2,
//         //   type: 'line',
//         //   data: res.positions,
//         // },
//       ],
//     };
//   }
// }
