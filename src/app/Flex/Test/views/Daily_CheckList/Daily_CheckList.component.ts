import { Component, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { TZ_USER_GROUP_MS } from '../../../Flex/models/tableModel';
import { FlexService } from '../../../Flex/services/flex.service';
import { ComboStringValue, ComboIntValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';
import { DateAdapter, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../Flex/components/format-datepicker';
import { PMS060_Search_Criteria } from '../../models/PMS060_Search_Criteria';

@Component({
    selector: 'app-sfm006',
    templateUrl: './Daily_CheckList.component.html',
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})

export class Daily_CheckListComponent implements OnInit {

    criteria: PMS060_Search_Criteria = new PMS060_Search_Criteria();
    machineList: PMS060_Search_Criteria[];
    isShowMachineList:Boolean;
    obj: any;
    isLoading:boolean
    data: any;
    notHavePermission: boolean = false;
    SpecialPermissionOH: any;

    comboShift: ComboIntValue[];
    comboLine: ComboIntValue[];
    comboMachineNo: ComboStringValue[];
    comboStatus: ComboStringValue[];

    comboStringAllItem: ComboStringValue = {
        VALUE: '',
        CODE: undefined,
        DISPLAY: 'All : - All -'
    };
    comboIntAllItem: ComboIntValue = {
        VALUE: 0,
        CODE: undefined,
        DISPLAY: 'All : - All -'
    };

    constructor(
        private svc: TestService,
        private dlg: DiaglogService,
        private flex: FlexService,

        private combo: ComboService,
        public popup: MatDialog,
        private dateAdapter: DateAdapter<any>
    ) {
        this.obj = {}
    }

    
    ngOnInit() {
        this.LoadData();
        this.InitialCombo();
        this.InitialCriteria()

    }

    InitialCriteria() {
        this.isShowMachineList = false;

        this.criteria.CUR_PERSON = '';
        this.criteria.PERSONINCHARGE = '';
        this.criteria.REQUESTER = '';

        this.criteria.STATUSID = 'F99';
        this.criteria.MACHINE_NO_FROM = '';
        this.criteria.MACHINE_NO_TO = '';
        this.criteria.VENDORID = 0;
        this.criteria.SCHEDULE_TYPEID = 0;
        this.criteria.MACHINE_LOC_CD = '';
    }
    InitialCombo() {

        this.combo.GetComboMachinePeriod().subscribe(res => {
            res.splice(0, 0, this.comboIntAllItem);   
            this.comboShift = res;      
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboMachinePeriod().subscribe(res => {
            res.splice(0, 0, this.comboIntAllItem);
            this.comboLine = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboMachine(true).subscribe(res => {
            res.splice(0, 0, this.comboStringAllItem);
            this.comboMachineNo = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboMachineStatus().subscribe(res => {
            res.splice(0, 0, this.comboStringAllItem);
            this.comboStatus = res;
        }, error => {
            this.dlg.ShowException(error);
        });

      
    }


    LoadData() {
        console.log("Load Data");
        this.isShowMachineList = true;
    }
    LoadMachine() {
        console.log("Load Machine");
    }

    OnEdit(data: TZ_USER_GROUP_MS) {
        console.log("Edit Data");
        // if (!data) { return; }
        // if (this.obj.SelectedData && data.GROUP_CD === this.obj.SelectedData.GROUP_CD) { return; }

        // this.obj.SelectedData = data;
        // this.svc.sp_SFM0061_GetPermission(data.GROUP_CD).subscribe(res => {
        //     this.obj.Screen = res;
        //     this.obj.SelectedScreen = null;
        // }, error => {
        //     this.dlg.ShowException(error);
        // });
    }
    OnClear() {
        this.criteria = new PMS060_Search_Criteria();
        this.machineList = null;
        this.InitialCriteria();
    }
    OnAddNew(){
        this.isShowMachineList = true;
    }
    OnEditScreen(data) {
        console.log("Edit Screen");
        // if (!data) { return; }
        // if (this.obj.SelectedScreen && data.SCREEN_CD === this.obj.SelectedScreen.SCREEN_CD) { return; }

        // this.obj.SelectedScreen = data;
    }
    OnClick(data) {
        console.log("Click Data");
        //   data.CAN_EXECUTE = !data.CAN_EXECUTE;
        //   this.OnChecked(data);
    }
    OnChecked(data) {
        console.log("Check Data");
        //   data.CAN_EXECUTE = data.CAN_EXECUTE === true ? 1 : 0;
        //   data.GROUP_CD = this.obj.SelectedData.GROUP_CD;
        //   this.svc.UpdatePermission(data).subscribe(res => {
        //       this.dlg.ShowProcessComplete();
        //   }, error => {
        //       this.dlg.ShowException(error);
        //   });
    }
}