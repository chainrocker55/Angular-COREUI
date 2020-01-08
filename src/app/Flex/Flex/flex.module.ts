// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { FlexLabelDirective } from './components/flexLabel.directive';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlexMinDirective } from '../custom/directive/flex-min-validator.directive';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FlexCombo } from '../custom/flex-combo/flex-combo.component';
import { FlexTime } from '../custom/flex-time/flex-time.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatListModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatRadioModule,
    DropDownsModule,
    NgSelectModule,
    TimepickerModule.forRoot()
  ],
  declarations: [
    FlexLabelDirective,
    FlexMinDirective,

    FlexCombo,
    FlexTime
  ],
  exports: [
    FlexLabelDirective,
    FlexMinDirective,

    CommonModule,
    FormsModule,

    MatListModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatBadgeModule,
    MatNativeDateModule,
    MatSelectModule,
    MatExpansionModule,
    MatRadioModule,
    DropDownsModule,
    NgSelectModule,
    TimepickerModule,

    FlexCombo,
    FlexTime
  ]
})
export class FlexModule { }
