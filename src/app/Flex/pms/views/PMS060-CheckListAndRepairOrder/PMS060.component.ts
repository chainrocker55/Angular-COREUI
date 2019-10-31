import { Component, OnInit, ViewChild  } from '@angular/core';
import { Observable } from 'rxjs';
import { FlexService } from '../../../Flex/services/flex.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { DiaglogService } from '../../../Flex/services/Dialog.service';

@Component({
  selector: 'app-pms060',
  templateUrl: './pms060.component.html',
})
export class PMS060Component implements OnInit {

  displayedColumns: string[] = ['CLS_INFO_CD', 'CLS_CD', 'CLS_DESC', 'SEQ', 'EDIT_FLAG'];
//   dataSource: MatTableDataSource<TB_CLASS_LIST_MS>;

  isLoading: boolean;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private dlg: DiaglogService) {
  }

  ngOnInit() {
  }
}
