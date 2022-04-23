import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeywordResearchContainerComponent } from './keyword-research-container/keyword-research-container.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { TabOneComponent } from './components/tab-one/tab-one.component';
import { TabTwoComponent } from './components/tab-two/tab-two.component';
import { TabThreeComponent } from './components/tab-three/tab-three.component';
import { TabFourComponent } from './components/tab-four/tab-four.component';
import { TabFiveComponent } from './components/tab-five/tab-five.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared';

const routes: Routes = [
  {
    path: '',
    component: KeywordResearchContainerComponent,
  },
];
@NgModule({
  declarations: [
    KeywordResearchContainerComponent,
    TabOneComponent,
    TabTwoComponent,
    TabThreeComponent,
    TabFourComponent,
    TabFiveComponent,
  ],
  imports: [
    CommonModule,
    ClarityModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class KeywordResearchModule {}
