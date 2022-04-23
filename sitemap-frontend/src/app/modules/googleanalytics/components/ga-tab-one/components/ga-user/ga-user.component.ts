import { Component, OnInit } from '@angular/core';
import { GaService } from '../../../../services';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-ga-user',
  templateUrl: './ga-user.component.html',
  styleUrls: ['./ga-user.component.scss'],
})
export class GaUserComponent implements OnInit {
  isLoading = false;
  error: string;
  echartsInstance;
  options = {
    responsive: true,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: [],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
  };
  merge;
  constructor(
    private readonly __gaService: GaService,
    private readonly __appService: AppService
  ) {}

  async getData() {
    try {
      this.isLoading = true;
      const res: any = await this.__gaService.getGaUser();
      this.setOptions(res);
      this.isLoading = false;
      this.error = null;
    } catch ({ error }) {
      this.error = error.message || 'Server Error';
    } finally {
      this.isLoading = false;
    }
  }
  async ngOnInit() {
    await this.getData();
    this.__appService.changeProjct.subscribe(async () => {
      await this.getData();
    });
  }
  async onChartInit(ec) {
    this.echartsInstance = ec;
  }

  setOptions({ months, users, sessions, views }) {
    this.merge = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      // grid: {
      //   right: '20%',
      // },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: months,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Users',
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#9b59b6',
            },
          },
        },
        {
          type: 'value',
          name: 'Sessions',
          position: 'right',

          axisLine: {
            show: true,
            lineStyle: {
              color: '#2980b9',
            },
          },
        },
        // {
        //   type: 'value',
        //   name: 'Pageviews',
        //   position: 'right',
        //   offset: 80,
        //   axisLine: {
        //     show: false,
        //     lineStyle: {
        //       color: '#2c3e50',
        //     },
        //   },
        // },
      ],
      legend: {
        data: ['Users', 'Sessions', 'Pageviews'],
        selected: {
          'Users': true,
          'Sessions': true,
          'Pageviews': false,
        }
      },
      visualMap: [
        {
          seriesIndex: 0,
          show: false,
          dimension: 0,
          pieces: [
            {
              lte: 0,
              color: '#9b59b6'
            },
            {
              gt: 0,
              lte: months.length - 2,
              color: '#9b59b6'
            },
            {
              gte: months.length - 2,
              lte: months.length,
              color: '#d7bce1'
            },
          ],
      }, {
        seriesIndex: 1,
        show: false,
        dimension: 0,
        pieces: [
          {
            lte: 0,
            color: '#2980b9'
          },
          {
            gt: 0,
            lte: months.length - 2,
            color: '#2980b9'
          },
          {
            gte: months.length - 2,
            lte: months.length,
            color: '#a9cce3',
          },
        ],
      }],
      series: [
        {
          name: 'Users',
          type: 'line',
          yAxisIndex: 0,
          color: '#9b59b6',
          //areaStyle: { normal: {} },
          smooth: 0.2,
          data: users,
        },
        {
          name: 'Sessions',
          type: 'line',
          color: '#2980b9',
          yAxisIndex: 1,
          smooth: 0.2,
          //areaStyle: { normal: {} },
          data: sessions,
        },
        // {
        //   name: 'Pageviews',
        //   color: '#2c3e50',
        //   yAxisIndex: 2,
        //   type: 'line',
        //   data: views,
        // },
      ],
    };
  }
}
