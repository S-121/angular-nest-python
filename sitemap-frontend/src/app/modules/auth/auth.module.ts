import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RegisterComponent,
  ResetPasswordComponent,
  LoginComponent,
} from './components';
import { AuthContainerComponent } from './auth-container/auth-container.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { MainModule } from '../main/main.module';

const routes: Routes = [
  { path: 'main', loadChildren: () => MainModule },
  {
    path: '',
    component: AuthContainerComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: RegisterComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
      {
        path: 'reset-password/:id',
        component: ResetPasswordComponent,
      },
    ],
  },
];
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthContainerComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ClarityModule,
    RouterModule.forChild(routes),
  ],
})
export class AuthModule {}
