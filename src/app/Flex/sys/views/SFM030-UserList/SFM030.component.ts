import { Component, OnInit, ViewChild  } from '@angular/core';
import { SystemService } from '../../services/system.service';
import { ComboService } from '../../../Flex/services/combo.service';
import { Observable } from 'rxjs';
import { FlexService } from '../../../Flex/services/flex.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DiaglogService, DialogData } from '../../../Flex/services/Dialog.service';
import { sp_SFM031_LoadUser_Result } from './sp_SFM031_LoadUser_Result';
import { MatCheckbox } from '@angular/material/checkbox';
import { TZ_USER_MS, TZ_MENU_SET_MS, TBM_DIVISION, TBM_POSITION, TZ_USER_GROUP_MS, TZ_LANG_MS } from '../../../Flex/models/tableModel';
import { PageSizeOptions } from '../../../Flex/constant';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sfm030',
  templateUrl: './SFM030.component.html',
})
export class SFM030Component implements OnInit {
    dataList: TZ_USER_MS[];
    comboMenuSet: TZ_MENU_SET_MS[];
    comboDivision: TBM_DIVISION[];
    comboPosition: TBM_POSITION[];
    comboGroup: TZ_USER_GROUP_MS[];
    comboLang: TZ_LANG_MS[];

    displayedColumns: string[] = ['USER_ACCOUNT', 'FULL_NAME', 'EMAILADDR'];
    dataSource: MatTableDataSource<TZ_USER_MS>;

    filterText: string;
    selectedData: sp_SFM031_LoadUser_Result;
    header: TZ_USER_MS;
    isLoading: boolean;
    isDataChange: boolean;
    errorMessage: string;
    pageOptions: number[];

    lblList: any;
    lblEntry: any;

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private combo: ComboService, private svc: SystemService, private flex: FlexService, private dlg: DiaglogService) {
  }

  ngOnInit() {
    this.pageOptions = PageSizeOptions;
    this.lblList = this.flex.GetScreenDetailDesc();
    this.lblEntry = this.flex.GetScreenDetailDescByCode('SFM031');
    this.InitialCombo();
    this.LoadData(false);
  }

  InitialCombo() {
    this.combo.GetComboMenuSet().subscribe(res => {
      this.comboMenuSet = res;
    }, (error) => {
      this.dlg.ShowErrorText(error.error);
    });
    this.combo.GetComboDivision().subscribe(res => {
      this.comboDivision = res;
    });
    this.combo.GetComboPosition().subscribe(res => {
      this.comboPosition = res;
    });
    this.combo.GetComboUserGroup().subscribe(res => {
      this.comboGroup = res;
    });
    this.combo.GetComboLanguage().subscribe(res => {
      this.comboLang = res;
    });
  }

  LoadData(isFilter: boolean) {
    this.svc.GetUserList().subscribe(res => {
        // this.dataList = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (isFilter) {
          this.applyFilter(this.filterText);
        }
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

  Edit(data: TZ_USER_MS) {
    this.isDataChange = false;
    this.header = new TZ_USER_MS();
    this.header.USER_ACCOUNT = data.USER_ACCOUNT;
    this.header.FULL_NAME = data.FULL_NAME;

    this.svc.GetUser(data).subscribe(res => {
      this.selectedData = res;
    }, (error) => {
      this.dlg.ShowException(error);
    });
  }

  Save(form) {
    this.dlg.ShowConfirm('CFM9001').subscribe( (result: DialogData) => {
      if (result && result.DialogResult === 'Yes') {
        this.isLoading = true;
        this.errorMessage = null;
        this.selectedData.FLG_ABSENCE = this.selectedData.FLG_ABSENCE.toString() === 'true' || this.selectedData.FLG_ABSENCE === 1 ? 1 : 0;
        this.selectedData.FLG_ACTIVE = this.selectedData.FLG_ACTIVE.toString() === 'true' || this.selectedData.FLG_ACTIVE === 1 ? 1 : 0;
        this.selectedData.FLG_RESIGN = this.selectedData.FLG_RESIGN.toString() === 'true' || this.selectedData.FLG_RESIGN === 1 ? 1 : 0;
        this.svc.SaveUser(this.selectedData).subscribe(res => {
          this.dlg.ShowProcessComplete();
          this.isLoading = false;
          this.isDataChange = true;
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.errorMessage = error.error.Message;
          } else {
            this.dlg.ShowException(error);
          }
          this.isLoading = false;
        });
      }
    });
  }

  Back() {
    this.selectedData = null;
    this.errorMessage = null;
    if (this.isDataChange) {
      this.LoadData(true);
    }
  }
}
