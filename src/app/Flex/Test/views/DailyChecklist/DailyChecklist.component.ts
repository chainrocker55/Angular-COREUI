import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { FlexService } from '../../../Flex/services/flex.service';
import { ComboStringValue, ComboIntValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';
import { DateAdapter, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../Flex/components/format-datepicker';
import { PMS150_Search_Criteria } from '../../models/PMS150_Search_Criteria';
import { PMSDailyChecklistService } from '../../services/PMS_DailyChecklist.service';
import { PMS150_GetDailyChecklist_Result } from '../../models/PMS150_GetDailyChecklist_Result';
import { DailyChecklistByLineComponent } from '../DailyChecklistByLine/DailyChecklistByLine.component';

@Component({
    selector: 'app-sfm006',
    templateUrl: './DailyChecklist.component.html',
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})

export class DailyChecklistComponent implements OnInit  {


    criteria: PMS150_Search_Criteria = new PMS150_Search_Criteria();
    checklist: PMS150_GetDailyChecklist_Result[];
    obj: any;
    isLoading: boolean
    data: any;
    notHavePermission: boolean = false;
    SpecialPermissionOH: any;
    disbleBox: Boolean = true;
    disableControl: Boolean;

    comboLine: ComboIntValue[];
    comboShift: ComboIntValue[];
    comboMachineNo: ComboStringValue[];
    comboStatus: ComboStringValue[];

    receivedChildMessage: string;

    comboStringAllItem: ComboStringValue = {
        VALUE: '',
        CODE: undefined,
        DISPLAY: 'All : - All -'
    };
    comboIntAllItem: ComboIntValue = {
        VALUE: -1,
        CODE: undefined,
        DISPLAY: 'All : - All -'
    };

    constructor(
        private svc: PMSDailyChecklistService,
        private dlg: DiaglogService,
        private flex: FlexService,

        private combo: ComboService,
        public popup: MatDialog,
        private dateAdapter: DateAdapter<any>
    ) {
        this.obj = {}
    }


    ngOnInit() {
        this.dateAdapter.setLocale(this.flex.getCurrentUser().LANG_CD);
        this.comboStringAllItem.DISPLAY = 'All : - All -';
        this.comboIntAllItem.DISPLAY = 'All : - All -';
        this.InitialCombo();
        this.InitialCriteria()

    }

    InitialCriteria() {
        this.criteria.SHIFTID = -1;
        this.criteria.LINEID = -1;;
        this.criteria.CHECK_DATE_FROM = null;
        this.criteria.CHECK_DATE_TO = null;
        this.criteria.STATUSID = '';
        this.criteria.MACHINE_NO = '';
        this.criteria.MACHINE_NAME = '';

        this.disableControl = false;
        this.disbleBox = true;
    }
    InitialCombo() {

        this.combo.GetComboShiftTypeDayNight().subscribe(res => {
            res.splice(0, 0, this.comboIntAllItem);
            this.comboShift = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboLineCode().subscribe(res => {
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

        this.combo.GetCombotDailyChecklistStatus().subscribe(res => {
            res.splice(0, 0, this.comboStringAllItem);
            this.comboStatus = res;
        }, error => {
            this.dlg.ShowException(error);
        });

    }


    LoadData() {
        this.isLoading = true;
        this.checklist = null;
        this.svc.GetDailyChecklist(this.criteria).subscribe(res => {
            // console.log(res);
            if (!res || res.length === 0) {
                this.dlg.ShowInformation('INF0001');
            }
            this.isLoading = false;
            this.checklist = res;
        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });


    }

    OnClear() {
        this.criteria = new PMS150_Search_Criteria();
        this.checklist = null;
    
        this.InitialCriteria();
    }


}