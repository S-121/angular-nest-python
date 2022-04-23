import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentWorkbookContainerComponent } from './content_workbook-container/content_workbook-container.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { TabOneComponent } from './components/tab-one/tab-one.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';
import { ContentWorkbookService } from './services/content_workbook.service';
import { CanDeactivateGuard } from './services';
import { TabThreeComponent } from './components/tab-three/tab-three.component';
import { TabTwoComponent } from './components/tab-two/tab-two.component';
import { TabFourComponent } from './components/tab-four/tab-four.component';

const routes: Routes = [
  {
    path: '',
    component: ContentWorkbookContainerComponent,
    canDeactivate: [CanDeactivateGuard],
  },
];
@NgModule({
  declarations: [
    ContentWorkbookContainerComponent,
    TabOneComponent,
    TabTwoComponent,
    TabThreeComponent,
    TabFourComponent,
  ],
  imports: [
    CommonModule,
    ClarityModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [CanDeactivateGuard, ContentWorkbookService],
})
export class ContentWorkbookModule {}
