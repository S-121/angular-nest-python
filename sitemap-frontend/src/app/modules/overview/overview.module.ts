import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewContainerComponent } from './overview-container/overview-container.component';
import {
  OverviewChartComponent,
  TopPerformingPagesComponent,
  EarningChartComponent,
} from './components';
import { Routes, RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts'; // FIXME
import { HttpClientModule } from '@angular/common/http';
import { GridItemDirective } from './directives';
import { ClarityModule } from '@clr/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';

const routes: Routes = [
  {
    path: '',
    component: OverviewContainerComponent,
  },
];
@NgModule({
  declarations: [
    OverviewContainerComponent,
    OverviewChartComponent,
    TopPerformingPagesComponent,
    EarningChartComponent,
    GridItemDirective,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ClarityModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
  ],

  entryComponents: [OverviewChartComponent, EarningChartComponent],
})
export class OverviewModule {}
