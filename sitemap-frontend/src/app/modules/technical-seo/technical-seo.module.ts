import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts'; // FIXME
import { HttpClientModule } from '@angular/common/http';
import { TechnicalSeoRoutingModule } from './technical-seo-routing.module';
import { ClarityModule } from '@clr/angular';
import { TechnicalSeoComponent } from './components/technical-seo/technical-seo.component';
import { SharedModule } from 'src/app/shared';
import { GoogleanalyticsModule } from 'src/app/modules/googleanalytics'

@NgModule({
  declarations: [TechnicalSeoComponent],
  imports: [
    CommonModule,
    TechnicalSeoRoutingModule,
    HttpClientModule,
    ClarityModule,
    SharedModule,
    GoogleanalyticsModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
  ]
})
export class TechnicalSeoModule { }
