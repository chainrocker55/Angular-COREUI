// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components Routing
import { SystemRoutingModule } from './system-routing.module';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { SFM030Component } from './views/SFM030-UserList/SFM030.component';
import { MAS090Component } from './views/MAS090-ClassList/MAS090.component';
import { SFM0035Component } from './views/SFM0035-UserProfile/SFM0035.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SystemRoutingModule,

    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
  ],
  declarations: [
    SFM030Component,
    MAS090Component,
    SFM0035Component,
  ]
})
export class SystemModule { }
