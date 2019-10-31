import { Component, OnInit, ViewChild  } from '@angular/core';
import { SystemService } from '../../services/system.service';
import { Observable } from 'rxjs';
import { FlexService } from '../../../Flex/services/flex.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { TB_CLASS_LIST_MS } from '../../models/tableModel';
import { PageSizeOptions } from '../../../Flex/constant';

@Component({
  selector: 'app-mas090',
  templateUrl: './mas090.component.html',
})
export class MAS090Component implements OnInit {

  displayedColumns: string[] = ['CLS_INFO_CD', 'CLS_CD', 'CLS_DESC', 'SEQ', 'EDIT_FLAG'];
  dataSource: MatTableDataSource<TB_CLASS_LIST_MS>;

  filterText: string;
  selectedData: TB_CLASS_LIST_MS;
  isLoading: boolean;

  pageOptions: number[];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private svc: SystemService, private dlg: DiaglogService) {
  }

  ngOnInit() {
    this.pageOptions = PageSizeOptions;
    this.LoadData();
  }

  LoadData() {
    this.svc.GetClassList().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    if (!filterValue) { filterValue = ''; }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  Clear() {
    this.filterText = '';
    this.applyFilter('');
  }

  Edit(data: TB_CLASS_LIST_MS) {
    this.selectedData = new TB_CLASS_LIST_MS();
    this.selectedData.CLS_INFO_CD = data.CLS_INFO_CD;
    this.selectedData.CLS_CD = data.CLS_CD;
    this.selectedData.CLS_DESC = data.CLS_DESC;
    this.selectedData.SEQ = data.SEQ;
    this.selectedData.EDIT_FLAG = data.EDIT_FLAG;
  }

  Save(form) {
    this.isLoading = true;
    this.svc.SaveClassList(this.selectedData).subscribe(res => {
      this.dlg.ShowProcessComplete();
      this.isLoading = false;
    },
    (error: HttpErrorResponse) => {
      this.dlg.ShowException(error);
      this.isLoading = false;
    });
  }

  Back() {
    this.selectedData = null;
  }
}
