import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts'; // FIXME
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { GaContainerComponent } from './ga-container/ga-container.component';
import {
  PerformanceComponent,
  GaTabOneComponent,
  GaUserComponent,
} from './components/';
import { LandingPagesComponent } from './components/ga-tab-one/components/landing-pages/landing-pages.component';
import { SharedModule } from 'src/app/shared';

const routes: Routes = [
  {
    path: '',
    component: GaContainerComponent,
  },
];
@NgModule({
  declarations: [
    GaContainerComponent,
    PerformanceComponent,
    GaTabOneComponent,
    GaUserComponent,
    LandingPagesComponent,
  ],
  imports: [
    SharedModule,
    ClarityModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
  ],

  entryComponents: [],
  exports: [PerformanceComponent]
})
export class GoogleanalyticsModule {}
