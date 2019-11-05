import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FlexService } from '../../../Flex/services/flex.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { ComboStringValue, ComboIntValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';
import { PMSService } from '../../services/pms.service';
import { PMS060_Search_Criteria } from '../../models/PMS060_Search_Criteria';
import { PMS060_CheckListAndRepairOrder_Result } from '../../models/PMS060_CheckListAndRepairOrder_Result';
import { PageSizeOptions, ComboStringAll } from '../../../Flex/constant';
import { MatExpansionModule } from '@angular/material/expansion';
import { PMS062_GetJobPmChecklist_Result } from '../../models/PMS062_GetJobPmChecklist_Result';
import { PMS060_CheckJobPersonInCharge_Result } from '../../models/PMS060_CheckJobPersonInCharge_Result';
import { ThemeRoutingModule } from '../../../../views/theme/theme-routing.module';

@Component({
    selector: 'app-pms060',
    templateUrl: './pms060.component.html',
})
export class PMS060Component implements OnInit {

    displayedColumns: string[] = ['CLS_INFO_CD', 'CLS_CD', 'CLS_DESC', 'SEQ', 'EDIT_FLAG'];
    displayedColumnsPersonInCharge: string[] = ['DISPLAY'];
    dataSource: MatTableDataSource<PMS060_CheckListAndRepairOrder_Result>;
    dataSourcePersonInCharge: MatTableDataSource<PMS060_CheckJobPersonInCharge_Result>;
    // dataPersonInCharge: PMS060_CheckJobPersonInCharge_Result[] = new Array();

    pageOptions: number[];
    isLoading: boolean;
    isDataChange: boolean;
    criteria: PMS060_Search_Criteria = new PMS060_Search_Criteria;
    dataList: PMS060_CheckListAndRepairOrder_Result[];
    data: any;
    dataFromList: PMS060_CheckListAndRepairOrder_Result;
    dataCheckList: any;

    SelectexPersonInCharge: any;

    comboUserWithPosition: ComboStringValue[];
    comboLocation: ComboStringValue[];
    comboSupplier: ComboIntValue[];
    comboSchduleType: ComboIntValue[];
    comboStatus: ComboStringValue[];
    comboMachine: ComboStringValue[];
    comboPoNumber: ComboIntValue[];

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(private dlg: DiaglogService, private combo: ComboService, private svc: PMSService) {
        this.pageOptions = PageSizeOptions;
    }

    ngOnInit() {
        this.InitialCombo();
    }

    InitialCriteria() {
    }

    InitialCombo() {

        this.combo.GetComboUserWithPosition().subscribe(res => {
            this.comboUserWithPosition = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboLocation().subscribe(res => {
            this.comboLocation = res;
        }, error => {
            this.dlg.ShowException(error);
        });


        this.combo.GetComboSupplier().subscribe(res => {
            this.comboSupplier = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboMachineScheduleType().subscribe(res => {
            this.comboSchduleType = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboMachineStatus().subscribe(res => {
            this.comboStatus = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboMachine().subscribe(res => {
            this.comboMachine = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboPoNumber().subscribe(res => {
            this.comboPoNumber = res;
        }, error => {
            this.dlg.ShowException(error);
        });
    }

    selectedRowIndex: number = -1;
    highlight(index) {
        this.selectedRowIndex = index;
    }


    RemovePersonIncharge() {
        if(!this.data.PersonInCharge)
            return;

        // const index = myArray.indexOf(key, 0);
        const index = this.selectedRowIndex;
        if (index > -1) {
            this.data.PersonInCharge.splice(index, 1);
        }
        this.dataSourcePersonInCharge = new MatTableDataSource(this.data.PersonInCharge);

        // set new selection
        if (this.selectedRowIndex >= this.data.PersonInCharge.length)
            this.selectedRowIndex = this.data.PersonInCharge.length - 1;
    }

    AddPersonIncharge() {
        if(!this.data.PersonInCharge)
            this.data.PersonInCharge=new Array();

        let selected = this.comboUserWithPosition.find(u => u.VALUE === this.SelectexPersonInCharge);
        if (!selected)
            return;

        let exists = this.data.PersonInCharge.find(u => u.PERSONINCHARGE === this.SelectexPersonInCharge);
        if (exists)
        {
            this.dlg.ShowWaring("VLM0771");
            return;
        }

        let item = new PMS060_CheckJobPersonInCharge_Result();
        item.DISPLAY = selected.DISPLAY
        item.PERSONINCHARGE = selected.VALUE;
        item.POSITIONID = +selected.CODE; // + mean convert to number 

        this.data.PersonInCharge.push(item);
        this.dataSourcePersonInCharge = new MatTableDataSource(this.data.PersonInCharge);

        this.SelectexPersonInCharge=null;
    }

    LoadData() {
        this.dataSourcePersonInCharge = new MatTableDataSource();

        this.isLoading = true;
        this.dataList = null;
        this.svc.GetCheckListAndRepairOrderList(this.criteria).subscribe(res => {
            if (!res || res.length === 0) {
                this.dlg.ShowInformation('INF0001');
            }
            this.isLoading = false;
            this.dataList = res;
        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });
    }

    OnAddNew() { }

    OnClear() {
        this.criteria = new PMS060_Search_Criteria();
        this.dataList = null;
    }

    OnEdit(data: PMS060_CheckListAndRepairOrder_Result) {
        this.isLoading = true;
        this.dataFromList = data;
        this.svc.GetCheckJob(data).subscribe((res) => {
            this.isLoading = false;
            this.data = res;
            this.dataSourcePersonInCharge = new MatTableDataSource(this.data.PersonInCharge);
        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });
    }

    Back() {
        this.data = null;
        if(this.isDataChange===true)
            this.LoadData();
    }

    SaveOH() {
        if (this.ValidateOH() == false)
            return;

        this.isLoading = true;
        this.svc.SaveOH(this.data).subscribe((res: string) => {
            this.isLoading = false;
            this.isDataChange = true;

            this.dlg.ShowSuccess("INF9003");

            this.dataFromList.CHECK_REPH_ID=res;
            this.OnEdit(this.dataFromList);

        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });
    }

    ValidateOH() {
        
        if(!this.data.PersonInCharge || this.data.PersonInCharge.length==0)
        {
            this.dlg.ShowWaring("VLM0770"); // No slelcted Person in Charge.
            return false;
        }
    }
}
