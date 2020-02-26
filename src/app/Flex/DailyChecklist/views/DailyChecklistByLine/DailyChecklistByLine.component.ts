import { Component, OnInit, Output, OnDestroy, EventEmitter } from '@angular/core';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { FlexService } from '../../../Flex/services/flex.service';
import { ComboStringValue, ComboIntValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';
import { DateAdapter, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../Flex/components/format-datepicker';
import { PMSDailyChecklistService } from '../../services/PMS_DailyChecklist.service';
import { PMS150_GetDailyChecklist_Result } from '../../models/PMS150_GetDailyChecklist_Result';
import { PMS151_GetDailyChecklist_Detail } from '../../models/PMS151_GetDailyChecklist_Detail';
import { MatTableDataSource } from '@angular/material/table';
import { PMS151_GetDailyChecklist_Detail_Item } from '../../models/PMS151_GetDailyChecklist_Detail_Item';
import { DLGPMS151_MachineItem } from '../DLGPMS151_MachineItem/DLGPMS151_MachineItem.component'
import { PMS150_SaveDailyChecklist } from '../../models/PMS150_SaveDailyChecklist';
import {formatDate} from '@angular/common';

@Component({
    selector: 'app-daily-by-line',
    templateUrl: './DailyChecklistByLine.component.html',
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ],
    styleUrls: ['../Style.css']
})

export class DailyChecklistByLineComponent implements OnInit, OnDestroy {

    STATUS_NEW = "L01"; // New Checklist
    STATUS_DURING = "L02"; // During Checking
    STATUS_COMPLETED = "L04"; // Completed Repair
    STATUS_CANCEL = "L05"; // Cancel Checklist
    STATUS_ISSUED_APPROVED = "L06"; // Issued Repair Order/Approved
    STATUS_COMPLETED_APPROVED = "L07"; // Completed Repair/Approved
    STATUS_IN_PROGRESS = "L99"; // In-Progress

    machineList: PMS151_GetDailyChecklist_Detail[];
    machineItemList: PMS151_GetDailyChecklist_Detail_Item[];
    obj: any;
    isLoading: boolean
    notHavePermission: boolean = false;
    criteriaHeader: PMS150_GetDailyChecklist_Result;
    disbleBox: Boolean = true;
    disableControl: Boolean;
    disabledNG: Boolean = true;
    checkall: Boolean;

    user_cd: string;
    @Output() IsRefresh = new EventEmitter<Boolean>();


    comboShiftByLine: ComboIntValue[];
    comboLineByLine: ComboIntValue[];
    comboStatus: ComboStringValue[];

    dataSourceMachine: MatTableDataSource<any>;
    dataSourceMachineItem: MatTableDataSource<any>;

    displayedColumnsMachine: string[] = ['NO', 'MACHINE_NO', 'MACHINE_NAME', 'NOT_USED', 'OK', 'NG', 'REPAIR_REQUEST'];

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
    ngOnDestroy(): void {

        this.OnClear();
    }

    InitialCriteria() {
        this.criteriaHeader = null;
        this.disableControl = false;
        this.disbleBox = true;
    }
    InitialCombo() {
        this.combo.GetComboShiftTypeDayNight().subscribe(res => {
            this.comboShiftByLine = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboLineCode().subscribe(res => {
            this.comboLineByLine = res;
        }, error => {
            this.dlg.ShowException(error);
        });
        

    }
    format(fmt, ...args) {
        if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
            throw new Error('invalid format string.');
        }
        return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
            if (str) {
                return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
            } else {
                if (index >= args.length) {
                    throw new Error('argument index is out of range in format');
                }
                return args[index];
            }
        });
    }

    ValidateCriteriaHeader(): boolean {

        if (this.criteriaHeader.LINEID == null ||
            this.criteriaHeader.SHIFTID == null ||
            this.criteriaHeader.CHECK_DATE == null ||
            !this.criteriaHeader
        ) {
            return false;
        }

        return true;
    }
    CreateChecklist() {
        if (!this.ValidateCriteriaHeader()) {
            this.dlg.ShowErrorText('Please input data');
            return;
        }

        this.svc.ValidateBeforePrepareDailyChecklist(this.criteriaHeader.LINEID, this.criteriaHeader.CHECK_DATE, this.criteriaHeader.SHIFTID)
            .subscribe((res: string) => {
                if (!res) {
                    this.svc.PrepareDailyChecklist(
                        this.criteriaHeader.LINEID,
                        this.criteriaHeader.CHECK_DATE,
                        this.criteriaHeader.SHIFTID,
                        this.flex.getCurrentUser().USER_CD,
                        this.STATUS_NEW,
                        this.flex.getCurrentUser().USER_CD
                    )
                        .subscribe(result => {
                            this.criteriaHeader.CHECKER = this.flex.getCurrentUser().USER_CD;
                            this.criteriaHeader.DAILY_CHECKLIST_HID = result.DAILY_CHECKLIST_HID;
                            this.criteriaHeader.DAILY_CHECKLIST_NO = result.DAILY_CHECKLIST_NO;
                            this.LoadMachine();
                            this.disableControl = true;

                        }, error => {
                            this.dlg.ShowException(error);
                        });

                } else {
                    var msg = this.flex.GetMessageObj(res)
                    if(res === 'VLM9075'){
                        this.dlg.ShowInformation(this.format(msg.MSG_DESC,this.criteriaHeader.LINEID.toString(),formatDate(this.criteriaHeader.CHECK_DATE,'dd MMM yyyy hh:mm a','en'),this.criteriaHeader.SHIFTID.toString()));
                    }else if (res === 'VLM9076'){
                        this.dlg.ShowInformation(this.format(msg.MSG_DESC,this.criteriaHeader.LINEID.toString()));
                    }

                    
                    //console.log(res)
                }

            }, error => {
                this.dlg.ShowException(error);
            })

    }
    ValidateBeforePrepair() {
        this.svc.ValidateBeforePrepareDailyChecklist(this.criteriaHeader.LINEID, this.criteriaHeader.CHECK_DATE, this.criteriaHeader.SHIFTID)
            .subscribe(res => {
                if (!res) {
                    return true;
                }
                this.dlg.ShowInformation(res);
                return false;
            }, error => {
                this.dlg.ShowException(error);
                return false
            })
        return false;

    }
    LoadMachine() {

        if (!this.ValidateCriteriaHeader()) {
            this.dlg.ShowErrorText('Please input data');
            return;
        }



        this.svc.GetDailyChecklist_Detail(this.criteriaHeader.DAILY_CHECKLIST_HID).subscribe(res => {
            if (!res || res.length === 0) {
                this.dlg.ShowInformation('INF0001');
                return;
            }
            this.isLoading = false;
            this.machineList = res;
            this.ValidateCheckAll();
            this.dataSourceMachine = new MatTableDataSource(this.machineList);

            this.LoadMachineItems();
        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });


    }
    LoadMachineItems() {
        if (!this.ValidateCriteriaHeader()) {
            this.dlg.ShowErrorText('Please input data');
            return;
        }

        this.svc.GetDailyChecklist_Detail_Item(this.criteriaHeader.DAILY_CHECKLIST_HID).subscribe(res => {
            // console.log(res);
            if (!res || res.length === 0) {
                this.dlg.ShowInformation('INF0001');
            }
            this.isLoading = false;
            this.machineItemList = res;

            this.dataSourceMachineItem = new MatTableDataSource(this.machineItemList);
        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });

    }
    OnClear() {
        this.criteriaHeader = null;
        this.machineList = null;
        this.machineItemList = null;
        this.dataSourceMachine = null;
        this.dataSourceMachineItem = null;
    }
    BackToSearch() {
        this.OnClear();
        this.criteriaHeader = null;
    }
    OnCheckAll() {
        if (this.checkall == true) {
            this.machineList.map(e => { e.CHECK_FLAG = 'O', e.NOT_USED = false, e.NG = false, e.OK = true })
            this.machineItemList.map(e => { e.OK = true, e.REMARK = null, e.NG = false, e.NG_REASON = null, e.CHECK_FLAG = null })
        } else {
            this.machineList.map(e => { e.CHECK_FLAG = null, e.NOT_USED = false, e.NG = false, e.OK = false })
            this.machineItemList.map(e => { e.OK = false, e.REMARK = null, e.NG = false, e.NG_REASON = null, e.CHECK_FLAG = null })
        }


        // if((isOK||isNOT_USED||data.NG) == false){
        //     data.CHECK_FLAG = null
        //     this.machineItemList.map(e => { e.OK = false, e.REMARK = null, e.NG = false, e.NG_REASON = null, e.CHECK_FLAG = null })
        // }
    }
    ValidateCheckAll() {
        var flag = this.machineList.find(e => e.OK == false)
        if (!flag) {
            this.checkall = true;
        }
        else {
            this.checkall = false;
        }
    }

    OnCheckedNOT_USED(data: PMS151_GetDailyChecklist_Detail) {

        var isOK = data.OK;
        var isNG = data.NG;
        var isNOT_USED = data.NOT_USED;


        if (isNOT_USED == true) {
            data.OK = false;
            data.NG = false;
            data.CHECK_FLAG = "N"
            this.machineItemList.filter(i => i.MACHINE_NO == data.MACHINE_NO).map(e => { e.OK = false, e.REMARK = null, e.NG = false, e.NG_REASON = null, e.CHECK_FLAG = null })
        }

        if ((isOK || isNOT_USED || isNG) == false) {
            data.CHECK_FLAG = null
            this.machineItemList.filter(i => i.MACHINE_NO == data.MACHINE_NO).map(e => { e.OK = false, e.REMARK = null, e.NG = false, e.NG_REASON = null, e.CHECK_FLAG = null })
        }

        this.ValidateCheckAll()
    }

    OnCheckedOK(data: PMS151_GetDailyChecklist_Detail) {

        var isOK = data.OK;
        var isNG = data.NG;
        var isNOT_USED = data.NOT_USED;

        if (isOK == true) {
            data.NG = false;
            data.NOT_USED = false;
            data.CHECK_FLAG = "O"
            this.machineItemList.filter(i => i.MACHINE_NO == data.MACHINE_NO).map(e => { e.OK = true, e.REMARK = null, e.NG = false, e.NG_REASON = null, e.CHECK_FLAG = "O" })

        }
        if ((isOK || isNOT_USED || data.NG) == false) {
            data.CHECK_FLAG = null
            this.machineItemList.filter(i => i.MACHINE_NO == data.MACHINE_NO).map(e => { e.OK = false, e.REMARK = null, e.NG = false, e.NG_REASON = null, e.CHECK_FLAG = null })
        }
        this.ValidateCheckAll()
    }
    OnEdit(data: PMS150_GetDailyChecklist_Result) {

        if (!data) { return; }
        this.criteriaHeader = data
        this.disableControl = true;

        this.LoadMachine();

    }
    OnAddNew() {
        this.OnClear();
        this.criteriaHeader = new PMS150_GetDailyChecklist_Result
        this.disableControl = false;
    }

    CheckByItem(row: PMS151_GetDailyChecklist_Detail) {

        let item = this.machineItemList
            .filter(e => e.MACHINE_NO == row.MACHINE_NO)
            .map(x => Object.assign({}, x));
        let machineNo = row.MACHINE_NO;


        const dialogRef = this.popup.open(DLGPMS151_MachineItem, {
            maxWidth: '1200px',
            minHeight: '400px',
            width: '1000px',
            height: '500px',
            disableClose: true,
            autoFocus: false,
            position: {},
            data: { item: item }
        });
        dialogRef.afterClosed().subscribe((result) => {

            if (result) {
                if (result.event === "Save") {

                    this.machineItemList = this.machineItemList
                        .filter(e => e.MACHINE_NO != machineNo)
                    this.machineItemList = this.machineItemList.concat(result.data)


                    var checkFlag = this.machineItemList.filter(e => e.MACHINE_NO == machineNo)[0].CHECK_FLAG


                    if (checkFlag === 'O') {
                        this.machineList.filter(i => i.MACHINE_NO == machineNo).map(e => { e.NOT_USED = false, e.OK = true, e.NG = false, e.CHECK_FLAG = "O" })
                    } else if (checkFlag === 'G') {
                        this.machineList.filter(i => i.MACHINE_NO == machineNo).map(e => { e.NOT_USED = false, e.OK = false, e.NG = true, e.CHECK_FLAG = "G" })
                    } else {
                        this.machineList.filter(i => i.MACHINE_NO == machineNo).map(e => { e.NOT_USED = false, e.OK = false, e.NG = false, e.CHECK_FLAG = null })
                    }

                }
            }


        })

    }

    OnSaveAndClose() {
        this.dlg.ShowConfirm("Do you want to save ?").subscribe(result => {
            if(result.DialogResult === 'Yes'){
                this.OnSave(this.STATUS_NEW);
                this.OnClear();
                this.IsRefresh.next(true)
            }
        })
       

    }
    OnSaveAndNew() {
       
        this.dlg.ShowConfirm("Do you want to save ?").subscribe(result => {
            if(result.DialogResult === 'Yes'){
                this.OnSave(this.STATUS_NEW);
                this.OnAddNew();
            }
        })
       
       
    }
    OnSave(status:string) {

        let saveDailyData = new PMS150_SaveDailyChecklist();
        saveDailyData.header = this.criteriaHeader;
        saveDailyData.header.STATUSID = status
        saveDailyData.machine = this.machineList;
        saveDailyData.items = this.machineItemList;
        saveDailyData.userID = this.flex.getCurrentUser().USER_CD

        this.svc.SaveDailyChecklist(saveDailyData).subscribe(res => {
            // console.log(res);
            if (!res) {
                this.dlg.ShowInformation('INF0001');
            }
            this.dlg.ShowSuccess("INF9003");

        }, error => {
            this.dlg.ShowException(error);
        });
    }

    OnCancel() {
        this.dlg.ShowConfirm("Do you want to cancel checklist ?").subscribe(result => {
            if(result.DialogResult ===  "Yes"){
                this.OnSave(this.STATUS_CANCEL)
                this.OnClear();
            }

        }, error => {
            this.dlg.ShowException(error);
        });
    }
    OnSendAppprove(){
        this.dlg.ShowConfirm("Do you want to send approve ?").subscribe(result => {
            if(result.DialogResult ===  "Yes"){
                // this.OnSave(this.STATUS_ISSUED_APPROVED)
                // this.OnClear();
            }

        }, error => {
            this.dlg.ShowException(error);
        });
    }


}