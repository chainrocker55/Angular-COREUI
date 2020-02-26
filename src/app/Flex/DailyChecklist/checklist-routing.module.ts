import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DailyChecklistComponent} from './views/DailyChecklist/DailyChecklist.component';
import { Dashboard } from './views/TestDashboard/Dashboard.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'DailyChecklist'
    },
    children: [
      {
        path: '',
        redirectTo: 'DailyChecklist'
      },
      {
        path: 'DailyChecklist',
        component: DailyChecklistComponent,
        data: {
          title: 'Daily Checklist'
        }
      },

      {
        path: 'Dashboard',
        component: Dashboard,
        data: {
          title: 'Dashboard'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChecklistRoutingModule {}
