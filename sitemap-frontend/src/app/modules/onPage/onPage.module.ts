import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnPageContainerComponent } from './onPage-container/onPage-container.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { TabOneComponent } from './components/tab-one/tab-one.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { OnPageService } from './services/onPage.service';
import { CanDeactivateGuard } from './services';

const routes: Routes = [
  {
    path: '',
    component: OnPageContainerComponent,
    canDeactivate: [CanDeactivateGuard],
  },
];
@NgModule({
  declarations: [OnPageContainerComponent, TabOneComponent],
  imports: [
    CommonModule,
    ClarityModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [CanDeactivateGuard, OnPageService],
})
export class OnPageModule {}
