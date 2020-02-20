import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { FlexService } from '../../../Flex/services/flex.service';
import { ComboStringValue, ComboIntValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';
import { DateAdapter, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../Flex/components/format-datepicker';
import { PMS150_Search_Criteria } from '../../models/PMS150_Search_Criteria';
import { PMSDailyChecklistService } from '../../services/PMS_DailyChecklist.service';
import { PMS150_GetDailyChecklist_Result } from '../../models/PMS150_GetDailyChecklist_Result';
import { Validators } from '@angular/forms';
import { isNull } from 'util';
import { PMS151_GetDailyChecklist_Detail } from '../../models/PMS151_GetDailyChecklist_Detail';
import { MatTableDataSource } from '@angular/material/table';
import { PMS151_GetDailyChecklist_Detail_Item } from '../../models/PMS151_GetDailyChecklist_Detail_Item';
import { DLGPMS151_MachineItem } from '../../views/DLGPMS151_MachineItem/DLGPMS151_MachineItem.component'
import { from, Observable, observable, BehaviorSubject } from 'rxjs';
import { Direction } from 'ngx-bootstrap/carousel/carousel.component';
import { ThrowStmt } from '@angular/compiler';
import { PMSService } from '../../../pms/services/pms.service';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';
import { async } from '@angular/core/testing';


@Component({
    selector: 'app-daily-by-line',
    templateUrl: './DailyChecklistByLine.component.html',
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ],
    styleUrls:['../Style.css']
})

export class DailyChecklistByLineComponent implements OnInit,OnDestroy {

    STATUS_NEW = "L01"; // New Checklist
    STATUS_DURING = "L02"; // During Checking
    STATUS_COMPLETED = "L04"; // Completed Repair
    STATUS_CANCEL = "L05"; // Cancel Checklist
    STATUS_ISSUED_APPROVED = "L06"; // Issued Repair Order/Approved
    STATUS_COMPLETED_APPROVED = "L07"; // Completed Repair/Approved
    STATUS_IN_PROGRESS = "L99"; // In-Progress

    machineList: PMS151_GetDailyChecklist_Detail[];
    machineItemList: PMS151_GetDailyChecklist_Detail_Item[];
    item : PMS151_GetDailyChecklist_Detail_Item[];
    obj: any;
    isLoading: boolean
    notHavePermission: boolean = false;
    criteriaHeader: PMS150_GetDailyChecklist_Result;
    disbleBox: Boolean = true;
    disableControl: Boolean;


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
    CreateChecklist(){
        if (!this.ValidateCriteriaHeader()) {
            this.dlg.ShowErrorText('Please input data');
            return;
        }
        
        this.svc.ValidateBeforePrepareDailyChecklist(this.criteriaHeader.LINEID,this.criteriaHeader.CHECK_DATE,this.criteriaHeader.SHIFTID)
        .subscribe((res: string)=>{
            if (!res) {
                console.log("criteriaHeader", this.criteriaHeader);
                this.svc.PrepareDailyChecklist(
                    this.criteriaHeader.LINEID,
                    this.criteriaHeader.CHECK_DATE,
                    this.criteriaHeader.SHIFTID,
                    this.flex.getCurrentUser().USER_CD,
                    this.STATUS_NEW,
                    this.flex.getCurrentUser().USER_CD
                    )
                .subscribe(result =>{
                    console.log("criteriaHeader", this.criteriaHeader);
                    this.criteriaHeader.CHECKER = this.flex.getCurrentUser().USER_CD;
                    this.criteriaHeader.DAILY_CHECKLIST_HID = result.DAILY_CHECKLIST_HID;
                    this.criteriaHeader.DAILY_CHECKLIST_NO = result.DAILY_CHECKLIST_NO;
                    this.LoadMachine();
                    this.disableControl = true;
                    
                },error => {
                    this.dlg.ShowException(error);
                });
                
            }else{
                this.dlg.ShowInformation(res);    
                //console.log(res)
            }
            
        },error=>{
            this.dlg.ShowException(error);
        })

    }
    ValidateBeforePrepair(){
        this.svc.ValidateBeforePrepareDailyChecklist(this.criteriaHeader.LINEID,this.criteriaHeader.CHECK_DATE,this.criteriaHeader.SHIFTID)
        .subscribe(res=>{
            console.log(res)
            if (!res) {
                return true;
            }
            console.log("Not Pass")
            this.dlg.ShowInformation(res);
            return false;      
        },error=>{
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
            // console.log(res);
            if (!res || res.length === 0) {
                this.dlg.ShowInformation('INF0001');
                return;
            }
            this.isLoading = false;
            this.machineList = res;
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
    OnEdit(data: PMS150_GetDailyChecklist_Result) {

        if (!data) { return; }
        this.criteriaHeader = data
        this.disableControl = true;

        this.LoadMachine();

    }
    OnAddNew() {
        this.OnClear();
        // this.InitialCriteria();
        // this.InitialCombo();
        this.criteriaHeader = new PMS150_GetDailyChecklist_Result
        this.disableControl = false;
    }
    CheckByItem(row: PMS151_GetDailyChecklist_Detail) {
        this.item = this.machineItemList.filter(e=>e.MACHINE_NO==row.MACHINE_NO)

        const dialogRef = this.popup.open(DLGPMS151_MachineItem, {
            maxWidth: '1200px',
            minHeight: '400px',
            width: '1000px',
            height: '500px',
            disableClose: true,
            autoFocus:false,
            position:{left:'250px'},
            data: {item:this.item}
        });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         // let data = new PMS151_GetDailyChecklist_Detail_Item[];
        //         Object.assign(this.machineItemList, result)
        //         console.log(this.machineItemList)
        //     }
        // });
    }
}