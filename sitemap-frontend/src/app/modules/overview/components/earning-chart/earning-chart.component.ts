import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services';

@Component({
  selector: 'app-earning-chart',
  templateUrl: './earning-chart.component.html',
  styleUrls: ['./earning-chart.component.scss'],
})
export class EarningChartComponent implements OnInit {
  widget: any;

  isLoading = false;
  error: string;
  echartsInstance;
  result: Array<any> = [];

  options: any = {};
  constructor(private readonly __dashboardService: DashboardService) { }

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
    this.__dashboardService.queryChanged.subscribe(async (_) => {
      await this.getData();
    });
  }
  async onChartInit(ec) {
    this.echartsInstance = ec;
  }

  setOptions(result) {


    let legend_data = [], append_with_yaxis = '';

    if (result[0].conversion_type === 'ecommerce') {
      legend_data = ['Organic Earnings', 'Total Earnings'];
      append_with_yaxis = '$';
    } else if (result[0].conversion_type === 'goal') {
      legend_data = ['Organic Goals', 'Total Goals'];
    }

    this.options = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          const total = params.find(p => p.seriesName.includes('Total'));
          const organic = params.find(p => p.seriesName.includes('Organic'));
          let totalResult: any = '0';
          if (total && organic) {
            totalResult = (parseFloat(total.value) + parseFloat(organic.value)).toFixed(2)
          } else if (total) {
            totalResult = parseFloat(total.value).toFixed(2);
          }

          let prefix = ''
          if(params[0].seriesName.includes('Earnings')) {
            prefix = '$'
          }

          if(params[0].seriesName.includes('Goals')) {
            totalResult = parseInt(totalResult);
          }

          return `<div>
            <div>${params[0].axisValue}</div>
            ${total ? `<div> ${total.marker} ${total.seriesName}&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${prefix}${totalResult}</b></div>` : ''}
            ${organic ? `<div> ${organic.marker} ${organic.seriesName}&nbsp;&nbsp;<b>${prefix}${organic.value}</b></div>` : ''}
          </div>`
        }
      },
      xAxis: [],
      yAxis: [{
        type: 'value',
        axisLabel: {
          formatter: function (value, index) {
            if(result[0].conversion_type === 'ecommerce') {
            return `$` + value;
            }
            return value;
          }
        }
      },],
      legend: {
        data: legend_data,
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
      let _this = this;
      let max_total_earnings = this.extractTotalEarningMaxValues(result.revenue);
      organicResult.revenue = organicResult.revenue.map(r => parseFloat(r));
      result.revenue = result.revenue.map(r => parseFloat(r));

      this.echartsInstance.on('legendselectchanged', function (params) {
        _this.options.legend.selected = params.selected;
        if ((params.selected['Organic Goals'] && params.selected['Total Goals'])
          || (params.selected['Organic Earnings'] && params.selected['Total Earnings'])) {
          // sets 7 max values from total earnings
          // _this.setYaxis(max_total_earnings, true, append_with_yaxis);
          _this.setSeries(legend_data,result,organicResult,index,true, true);
        } else if (params.selected['Organic Earnings'] || params.selected['Organic Goals']) {
          // _this.setYaxis(organicResult.revenue, false, append_with_yaxis);
          _this.setSeries(legend_data,result,organicResult,index,false, true);
        } else if (params.selected['Total Earnings'] || params.selected['Total Goals']) {
          _this.setYaxis(result.revenue, false, append_with_yaxis);
          _this.setSeries(legend_data,result,organicResult,index,true,false);
        }
      });

      this.options.xAxis.push({
        type: 'category',
        data: result.x,
        gridIndex: index,
      });

      // this.setYaxis(max_total_earnings, true, append_with_yaxis);
      this.setSeries(legend_data,result,organicResult,index,true, true)

    });
  }

  setSeries(legend_data, result, organicResult, index, totalSries, organicSeries) {
    const remaning = result.revenue.map((a, i) => (a - organicResult.revenue[i]));
    if (totalSries && organicSeries) {
      this.options.series = [
        {
          name: legend_data[0],
          type: 'bar',
          stack: 'one',
          barWidth: '60%',
          color: '#9b59b6',
          data: organicResult.revenue,
          xAxisIndex: index,
          yAxisIndex: index,
        },
        {
          name: legend_data[1],
          type: 'bar',
          stack: 'one',
          barWidth: '60%',
          color: '#2980b9',
          data: remaning,
          xAxisIndex: index,
          yAxisIndex: index,
        },
      ];
    } else if(organicSeries) {
      this.options.series = [
        {
          name: legend_data[0],
          type: 'bar',
          stack: 'one',
          barWidth: '60%',
          color: '#9b59b6',
          data: organicResult.revenue,
          xAxisIndex: index,
          yAxisIndex: index,
        }
      ];
    } else if(totalSries) {
      this.options.series = [
        {
          name: legend_data[1],
          type: 'bar',
          stack: 'one',
          barWidth: '60%',
          color: '#2980b9',
          data: result.revenue,
          xAxisIndex: index,
          yAxisIndex: index,
        }
      ];
    }
    this.echartsInstance.setOption(this.options);
  }

  /*
   * Extract seven max values from total earnings 
  */
  extractTotalEarningMaxValues(total_earnings) {


    let sorted = Array.from(new Set(total_earnings)).sort(function (a: any, b: any) {
      return a - b;
    });
    let earning_max_values = sorted.slice(Math.max(sorted.length - 7, 0))

    if (earning_max_values.length <= 6 && !earning_max_values.includes('0')) {
      earning_max_values.splice(0, 0, '0').join();
      return earning_max_values;
    }

    return earning_max_values;

  }

  setYaxis(revenue_data, legend_selected = true, append_with_yaxis) {

    this.options.yAxis = [];
    if (legend_selected) {
      this.options.yAxis.push({
        type: 'value',
        gridIndex: 0,
        axisLabel: {

          formatter: function(value, index) {

            if (index === 0 && revenue_data.length > 6)
              return append_with_yaxis + 0;

            if (revenue_data.length >= 6)  
              index++; 

            if (typeof revenue_data[index] !== 'undefined')
              return append_with_yaxis + revenue_data[index];
          }
        }
      });
    } else {
      this.options.yAxis.push({
        type: 'value',
        data: revenue_data,
        gridIndex: 0,
        axisLabel: {
          formatter: function(value, index) {
            return append_with_yaxis + value;
          }
        }
      });
    }

    this.echartsInstance.setOption(this.options);
  }

}