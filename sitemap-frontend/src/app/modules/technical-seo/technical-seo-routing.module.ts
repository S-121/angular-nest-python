import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechnicalSeoComponent } from './components/technical-seo/technical-seo.component'

const routes: Routes = [{
  path: '',
  component: TechnicalSeoComponent
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TechnicalSeoRoutingModule { }
