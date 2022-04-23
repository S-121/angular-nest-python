import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortNumberPipe, PagePathPipe } from './pipes';
import { UpdatableTableComponent } from './components';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  declarations: [ShortNumberPipe, PagePathPipe, UpdatableTableComponent],
  imports: [FormsModule, CommonModule, ClarityModule, DragulaModule.forRoot()],
  exports: [ShortNumberPipe, PagePathPipe, UpdatableTableComponent],
})
export class SharedModule {}
