import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterWqaContainerComponent } from './master-wqa-container/master-wqa-container.component';
import { Routes, RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: MasterWqaContainerComponent,
  },
];
@NgModule({
  declarations: [MasterWqaContainerComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ClarityModule,
    HttpClientModule,
    RouterModule.forChild(routes),
  ],
})
export class MasterWqaModule {}
