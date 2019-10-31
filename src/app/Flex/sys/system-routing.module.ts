import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MAS090Component } from './views/MAS090-ClassList/MAS090.component';
import { CardsComponent } from '../../views/base/cards.component';
import { SFM0035Component } from './views/SFM0035-UserProfile/SFM0035.component';
import { SFM030Component } from './views/SFM030-UserList/SFM030.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'System Maintenance'
    },
    children: [
      {
        path: '',
        redirectTo: 'users'
      },
      {
        path: 'me',
        component: SFM0035Component,
        data: {
          title: 'User Profile'
        }
      },
      {
        path: 'users',
        component: SFM030Component,
        data: {
          title: 'User List'
        }
      },
      {
        path: 'classlist',
        component: MAS090Component,
        data: {
          title: 'Class List'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
