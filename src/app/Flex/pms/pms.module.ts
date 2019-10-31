// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components Routing
import { PMSRoutingModule } from './pms-routing.module';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { PMS060Component } from './views/PMS060-CheckListAndRepairOrder/PMS060.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PMSRoutingModule,

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
    PMS060Component,
  ]
})
export class PMSModule { }
