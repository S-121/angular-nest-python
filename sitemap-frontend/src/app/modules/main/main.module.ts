import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContainerComponent } from './main-container/main-container.component';
import { Routes, RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { SidenavComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: MainContainerComponent,
    children: [
      {
        path: 'projects',
        loadChildren: () =>
          import('../../modules/projects/projects.module').then(
            (m) => m.ProjectsModule
          ),
      },
      {
        path: 'overview',
        loadChildren: () =>
          import('../../modules/overview/overview.module').then(
            (m) => m.OverviewModule
          ),
      },
      {
        path: 'googleanalytics',
        loadChildren: () =>
          import('../../modules/googleanalytics/googleanalytics.module').then(
            (m) => m.GoogleanalyticsModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../../modules/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'keyword-research',
        loadChildren: () =>
          import('../../modules/keyword-research/keyword-research.module').then(
            (m) => m.KeywordResearchModule
          ),
      },
      {
        path: 'keyword-tracking',
        loadChildren: () =>
          import('../../modules/keyword-tracking/keyword-tracking.module').then(
            (m) => m.KeywordTrackingModule
          ),
      },
      // {
      //   path: 'wqa',
      //   loadChildren: () =>
      //     import('../../modules/master-wqa/master-wqa.module').then(
      //       (m) => m.MasterWqaModule
      //     ),
      // },
      // {
      //   path: 'onPage',
      //   loadChildren: () =>
      //     import('../../modules/onPage/onPage.module').then(
      //       (m) => m.OnPageModule
      //     ),
      // },
      // {
      //   path: 'content-workbook',
      //   loadChildren: () =>
      //     import('../../modules/content_workbook/content_workbook.module').then(
      //       (m) => m.ContentWorkbookModule
      //     ),
      // },
      {
        path: 'technical-seo',
        loadChildren: () =>
          import('../../modules/technical-seo/technical-seo.module').then(
            (m) => m.TechnicalSeoModule
          ),
      },
      // {
      //   path: 'dashboard',
      //   loadChildren: () =>
      //     import('../../modules/dashboard/dashboard.module').then(
      //       (m) => m.DashboardModule
      //     ),
      // },
    ],
  },
];

@NgModule({
  declarations: [MainContainerComponent, SidenavComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ClarityModule],
})
export class MainModule {}
