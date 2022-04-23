import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersContainerComponent } from './users-container/users-container.component';
import { UsersListComponent, DoUserComponent } from './components';
import { Routes, RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: UsersContainerComponent,
    children: [
      {
        path: '',
        component: UsersListComponent,
      },
      {
        path: 'do',
        component: DoUserComponent,
      },
      {
        path: 'do/:id',
        component: DoUserComponent,
      },
    ],
  },
];
@NgModule({
  declarations: [UsersContainerComponent, UsersListComponent, DoUserComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ClarityModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class UsersModule {}
