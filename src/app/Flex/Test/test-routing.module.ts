import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Test001Component} from './views/Test-View/Test001.component';
import {DailyChecklistComponent} from './views/DailyChecklist/DailyChecklist.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Maintenance'
    },
    children: [
      {
        path: '',
        redirectTo: 'test001'
      },
      {
        path: 'test001',
        component: Test001Component,
        data: {
          title: 'Test path'
        }
      },
      {
        path: 'DailyChecklist',
        component: DailyChecklistComponent,
        data: {
          title: 'Daily Checklist'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule {}
