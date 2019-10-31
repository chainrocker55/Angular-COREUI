import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PMS060Component } from './views/PMS060-CheckListAndRepairOrder/PMS060.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Maintenance'
    },
    children: [
      {
        path: '',
        redirectTo: 'pms060'
      },
      {
        path: 'pms060',
        component: PMS060Component,
        data: {
          title: 'Checklist and Repair'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PMSRoutingModule {}
