import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Test001Component} from './views/Test-View/Test001.component';
import {Daily_CheckListComponent} from './views/Daily_CheckList/Daily_CheckList.component'

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
        path: 'DailyCheckList',
        component: Daily_CheckListComponent,
        data: {
          title: 'Daily CheckList'
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
