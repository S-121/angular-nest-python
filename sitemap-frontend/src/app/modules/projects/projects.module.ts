import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsContainerComponent } from './projects-container/projects-container.component';
import {
  ProjectsListComponent,
  ProjectUsersComponent,
  DoProjectComponent,
} from './components';
import { Routes, RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: ProjectsContainerComponent,
    children: [
      {
        path: '',
        component: ProjectsListComponent,
      },
      {
        path: 'do',
        component: DoProjectComponent,
      },
      {
        path: 'do/:id',
        component: DoProjectComponent,
      },
    ],
  },
];
@NgModule({
  declarations: [
    ProjectsContainerComponent,
    ProjectsListComponent,
    DoProjectComponent,
    ProjectUsersComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ClarityModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class ProjectsModule {}
