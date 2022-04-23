import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface, ClrDatagrid, ClrDatagridPagination } from '@clr/angular';
import { KeywordService } from '../../services';
import { debounce, searchSort } from 'src/app/shared';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-tab-two',
  templateUrl: './tab-two.component.html',
  styleUrls: ['./tab-two.component.scss'],
})

export class TabTwoComponent implements AfterViewInit {
  objectKeys = Object.keys;
  error: string;
  isLoadings = false;
  data: any;
  dataKeys = [];
  header: any[];
  pageSize: number = 15;
  offset: number = 0;
  count: number = 11;
  refreshFn: Function;
  updateItem: Function;
  firstCall = true;
  params = null;
  maxPriorityScore: number;
  @ViewChild('datagridRef') datagrid: ClrDatagrid;

  constructor(
    private readonly __keywordService: KeywordService,
    private readonly __appService: AppService
  ) {
    this.refreshFn = debounce(this.refresh);
    this.updateItem = debounce(this.updateItemFn);
  }
  @ViewChild('paginationSimple') pagination: ClrDatagridPagination;

  async getData(
    first = false,
    offset = this.offset,
    pageSize = this.pageSize,
    params = undefined
  ) {
    try {
      if (this.datagrid) {
        this.datagrid.dataChanged();
        this.datagrid.resize();
      }
      this.isLoadings = true;
      const {
        data,
        count,
        maxPriorityScore,
      } = await this.__keywordService.getkeyword(0, offset, pageSize, params);
      this.maxPriorityScore = maxPriorityScore;
      this.data = data.map(this.formula.bind(this));
      this.count = count;
      requestAnimationFrame(() => {
        if (this.datagrid) {
          this.datagrid.dataChanged();
          this.datagrid.resize();
        }
      });
      this.error = null;
    } catch (err) {
      const { error } = err;
      this.error = err || error.message || 'Server Error';
    } finally {
      this.isLoadings = false;
    }
  }

  async getDataCSV() {
    try {
      this.isLoadings = true
      const that = this;
      await this.__keywordService.getCSV().then(function(res){
        console.log(res)
        const data = res[0]
        that.data = data;
        that.dataKeys = Object.keys(that.data.cpc)
      })
    } catch ({ error }) {
      console.log("Error", error);
    } finally {
      this.isLoadings = false;
    }
  }

  async ngAfterViewInit(): Promise<void> {
    // await this.getData(true);
    // this.__appService.changeProjct.subscribe(async () => {
    //   await this.getData();
    // });

    await this.getDataCSV();
    this.__appService.changeProjct.subscribe(async () => {
      await this.getDataCSV();
    });
  }

  async refresh(state: ClrDatagridStateInterface) {
    this.params = searchSort(state);
    this.offset = state.page.size * (state.page.current - 1);
    await this.getData(false, this.offset, this.pageSize, this.params);
  }

  async updateItemFn(item, fetch = false) {
    this.formula(item);
    if (fetch) {
      await this.getData(false, this.offset, this.pageSize, this.params);
    }
  }

  formula(item) {
    item.avgRD = this.getAvg(
      item.rdToFirstResult,
      item.rdToSecondResult,
      item.rdToThirdResult
    );
    item.avgDA = this.getAvg(
      item.daOfFirstResult,
      item.daOfSecondResult,
      item.daOfThirdResult
    );
    item.avgPA = this.getAvg(
      item.paOfFirstResult,
      item.paOfSecondResult,
      item.paOfThirdResult
    );
    item.avgVelocity = this.getAvg(
      item.rdVelocity,
      item.secondRdVelocity,
      item.thirdRdVelocity
    );
    item.daOpportuniyScore = this.getDAOpportuniyScore(item);
    item.paOpportuniyScore = this.getPAOpportuniyScore(item);
    item.linksOpportuniyScore = this.getLinksOpportuniyScore(item);
    item.opportuniyToRank = Math.round(
      (item.daOpportuniyScore +
        item.paOpportuniyScore +
        item.linksOpportuniyScore) /
      3
    );

    item.priorityScore =
      (item.opportuniyToRank *
        (100 - Number(item.primaryKeywordRanking || 0))) /
      100;
    item.targetPage = Number(item.priorityScore) >= this.maxPriorityScore * 0.5;
    this.__keywordService.updateRow(item).then(() => { });
    return item;
  }
  getAvg(...a) {
    a = a.filter((a) => a);
    return Math.round(
      a.length &&
      a.reduce((acc, cur) => {
        acc += Number(cur);
        return acc;
      }, 0) / a.length
    );
  }

  getDAOpportuniyScore(item) {
    const da = Number(item.da);
    const avgDA = Number(item.avgDA);
    if (da === 0 || avgDA === 0) {
      return 0;
    }
    if (avgDA < da) {
      return Math.round(100 - 50 / (da * avgDA));
    } else if (avgDA < da + ((100 - da) * 3) / 8) {
      return Math.round(50 - (50 / (((100 - da) * 3) / 8)) * (avgDA - da));
    } else {
      return 0;
    }
  }

  getPAOpportuniyScore(item) {
    const pa = Number(item.pa);
    const avgPA = Number(item.avgPA);
    if (pa === 0 || avgPA === 0) {
      return 0;
    }
    if (avgPA < pa) {
      return Math.round(100 - 50 / (pa * avgPA));
    } else if (avgPA < pa + ((100 - pa) * 3) / 8) {
      return Math.round(50 - (50 / (((100 - pa) * 3) / 8)) * (avgPA - pa));
    } else {
      return 0;
    }
  }

  getLinksOpportuniyScore(item) {
    const rd = Number(item.rdLinks);
    const avgRD = Number(item.avgRD);
    if (rd === 0 || avgRD === 0) {
      return 0;
    }

    if (avgRD < rd) {
      return Math.round(100 - (50 / rd) * avgRD);
    } else if (avgRD < rd + 30) {
      return Math.round(50 - (50 / 30) * (avgRD - rd));
    } else {
      return 0;
    }
  }
}
