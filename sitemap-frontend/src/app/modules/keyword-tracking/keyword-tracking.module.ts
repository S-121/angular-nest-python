import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeywordTrackingComponent } from './keyword-tracking-container/keyword-tracking-container.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { TabOneComponent } from './components/tab-one/tab-one.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';

const routes: Routes = [
  {
    path: '',
    component: KeywordTrackingComponent,
  },
];
@NgModule({
  declarations: [KeywordTrackingComponent, TabOneComponent],
  imports: [
    CommonModule,
    ClarityModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class KeywordTrackingModule {}
