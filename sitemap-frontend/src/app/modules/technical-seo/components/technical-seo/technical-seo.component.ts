import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { GaService } from 'src/app/modules/googleanalytics/services/ga.service';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';
@Component({
  selector: 'app-technical-seo',
  templateUrl: './technical-seo.component.html',
  styleUrls: ['./technical-seo.component.scss']
})
export class TechnicalSeoComponent implements OnInit {

  isLoading: boolean;
  error: string;
  echartsInstance;
  options: any = {
    height: 500
  };
  merge;
  results = [];
  device : string = 'desktop';
  selectedGraphResults = { FCP: false, CLS: true, LCP: true }
  constructor(
    private readonly __appService: AppService,
    private readonly __gaService: GaService,

  ) { }

  async getData() {
    try {
      this.isLoading = true;
      const res = await this.__gaService.getPerformanceData();
      this.setOptions(res.data);
      this.isLoading = false;
    } catch ({ error }) {
      this.error = error.message || 'Server Error';
    } finally {
      this.isLoading = false;
    }
  }

  public changeDevice(type: string) {
    this.device = type;
    const convertedData = this.extractData(this.results, this.selectedGraphResults)
    this.setSeries(convertedData);
    this.options.xAxis = [{
      type: 'category',
      data: Object.keys(convertedData),
      gridIndex: 0,
    }];

    // this.setYaxis(max_total_earnings, true, append_with_yaxis);
    this.options.yAxis = [{
      type: 'value',
      gridIndex: 0,
      axisLabel: {
        formatter: function (value, index) {
          return value;
        }
      }
    }];
    this.echartsInstance.setOption(this.options);
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.__appService.changeProjct.subscribe(async () => {
      await this.getData();
    });
  }

  async onChartInit(ec) {
    this.echartsInstance = ec;
  }

  setOptions(result) {
    this.results = result;
    const legend_data = ['FCP', 'CLS', 'LCP'];
    this.options = {
      height: 240,
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
        data: legend_data,
        selected: legend_data.reduce((t, a) => {
          t[a] = true;
          return t;
        }, {})
      },
      series: [],
      grid: null,
    };

    if (result.length > 1) {
      this.options.grid = [{ bottom: '55%' }, { top: '55%' }];
    } else {
      this.options.grid = null;
    }
    const convertedData = this.extractData(this.results, this.selectedGraphResults);
    this.setSeries(convertedData);
    const _this = this;
    this.echartsInstance.on('legendselectchanged', function (params) {
      const convertedData = _this.extractData(_this.results, params.selected);
      _this.setSeries(convertedData);
      _this.options.legend.selected = params.selected;
      _this.echartsInstance.setOption(_this.options);
      _this.selectedGraphResults = params.selected;
    });
    this.options.xAxis = [{
      type: 'category',
      data: Object.keys(convertedData),
      gridIndex: 0,
    }];

    // this.setYaxis(max_total_earnings, true, append_with_yaxis);
    this.options.yAxis = [{
      type: 'value',
      gridIndex: 0,
      axisLabel: {
        formatter: function (value, index) {
          return value;
        }
      }
    }];
    this.echartsInstance.setOption(this.options);
  }


  extractData(result, keys) {
    const convertedData = {}
    result = result.filter(a=> a.device == this.device || (!a.device && this.device == 'desktop'))
    result.forEach((row_data, index) => {
      let _this = this;
      const dateKey = new Date(row_data.record_date).toLocaleDateString();
      if (!convertedData[dateKey]) {
        convertedData[dateKey] = {
          passing: 0,
          needImprovements: 0,
          failing: 0
        }
      }
      let arr = []
      if (keys.FCP) {
        arr.push({ key: 'fcp_score', value: 'fcp' })
      }

      if (keys.LCP) {
        arr.push({ key: 'lcp_score', value: 'lcp' })

      }
      if (keys.CLS) {
        arr.push({ key: 'cls_score', value: 'cls' })
      }

      arr.forEach(row => {
        const key = row.value;
        const value = row_data[row.key];
        switch (value) {
          case "AVERAGE": {
            convertedData[dateKey].needImprovements += 1;
            break;
          }
          case 'FAST': {
            convertedData[dateKey].passing += 1;
            break;
          }
          case 'SLOW': {
            convertedData[dateKey].failing += 1;
            break;
          }
        }
      });
    })
    return convertedData;
  }

  setSeries(convertedData) {
    this.options.series = [
      {
        name: 'Failing',
        type: 'bar',
        stack: 'one',
        barWidth: '60%',
        color: '#c0392b',
        data: Object.values(convertedData).map((a: any) => a.failing),
      },
      {
        name: 'Passing',
        type: 'bar',
        stack: 'one',
        barWidth: '60%',
        color: '#27ae60',
        data: Object.values(convertedData).map((a: any) => a.passing),
      },
      {
        name: 'Need Improvements',
        type: 'bar',
        stack: 'one',
        barWidth: '60%',
        color: '#f1c40f',
        data: Object.values(convertedData).map((a: any) => a.needImprovements),
      },
      {
        name: 'FCP',
        type: 'bar',
        stack: 'one',
        barWidth: '10%',
        color: '#2980b9',
        data: []
      },
      {
        name: 'CLS',
        type: 'bar',
        stack: 'one',
        barWidth: '10%',
        color: '#2980b9',
        data: []
      },
      {
        name: 'LCP',
        type: 'bar',
        stack: 'one',
        barWidth: '10%',
        color: '#2980b9',
        data: []
      },
    ];
  }

  sumValues(...values) {
    return values.reduce((t, c) => {
      t += parseFloat(c.replace(/\D/g, ''));
      return t;
    }, 0)
  }
}
