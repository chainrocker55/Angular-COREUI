import { Component, OnInit, ViewChild  } from '@angular/core';
import { Observable } from 'rxjs';
import { FlexService } from '../../../Flex/services/flex.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { ComboStringValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';
import { PMSService } from '../../services/pms.service';
import { PMS060_Search_Criteria } from '../../models/PMS060_Search_Criteria';
import { PMS060_CheckListAndRepairOrder_Result } from '../../models/PMS060_CheckListAndRepairOrder_Result';
import { PageSizeOptions } from '../../../Flex/constant';

@Component({
  selector: 'app-pms060',
  templateUrl: './pms060.component.html',
})
export class PMS060Component implements OnInit {

  displayedColumns: string[] = ['CLS_INFO_CD', 'CLS_CD', 'CLS_DESC', 'SEQ', 'EDIT_FLAG'];
  dataSource: MatTableDataSource<PMS060_CheckListAndRepairOrder_Result>;

  pageOptions: number[];
  isLoading: boolean;
  criteria: PMS060_Search_Criteria = new PMS060_Search_Criteria;
  selectedData: any;

  comboPersonInCharge: ComboStringValue[];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private dlg: DiaglogService, private combo: ComboService, private svc: PMSService) {
  }

  ngOnInit() {
    this.pageOptions = PageSizeOptions;
    this.InitialCombo();
  }

  InitialCriteria() {
  }

  InitialCombo() {
    this.combo.GetComboPersonInCharge_KIBUN().subscribe(res => {
      this.comboPersonInCharge = res;
    }, error => {
      this.dlg.ShowException(error);
    });
  }

  LoadData() {
    this.svc.GetCheckListAndRepairOrderList(this.criteria).subscribe(res => {
      console.log('LoadData', res);
    }, error => {
      this.dlg.ShowException(error);
    });
  }
}
