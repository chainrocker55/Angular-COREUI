import { Component, OnInit } from '@angular/core';
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
import { from } from 'rxjs';
import { Direction } from 'ngx-bootstrap/carousel/carousel.component';


@Component({
    selector: 'app-sfm006',
    templateUrl: './DailyChecklist.component.html',
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})

export class DailyChecklistComponent implements OnInit {

    criteria: PMS150_Search_Criteria = new PMS150_Search_Criteria();
    checklist: PMS150_GetDailyChecklist_Result[];
    machineList: PMS151_GetDailyChecklist_Detail[];
    machineItemList: PMS151_GetDailyChecklist_Detail_Item[];
    item : PMS151_GetDailyChecklist_Detail_Item[];
    obj: any;
    isLoading: boolean
    data: any;
    notHavePermission: boolean = false;
    SpecialPermissionOH: any;
    criteriaHeader: PMS150_GetDailyChecklist_Result;
    disbleBox: Boolean = true;
    disableControl: Boolean;

    comboShift: ComboIntValue[];
    comboLine: ComboIntValue[];
    comboShiftByLine: ComboIntValue[];
    comboLineByLine: ComboIntValue[];
    comboMachineNo: ComboStringValue[];
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

    InitialCriteria() {
        this.criteria.SHIFTID = -1;
        this.criteria.LINEID = -1;;
        this.criteria.CHECK_DATE_FROM = null;
        this.criteria.CHECK_DATE_TO = null;
        this.criteria.STATUSID = '';
        this.criteria.MACHINE_NO = '';
        this.criteria.MACHINE_NAME = '';
        this.criteriaHeader = null;

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

        this.combo.GetComboShiftTypeDayNight().subscribe(res => {
            this.comboShiftByLine = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboLineCode().subscribe(res => {
            res.splice(0, 0, this.comboIntAllItem);
            this.comboLine = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboLineCode().subscribe(res => {
            this.comboLineByLine = res;
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
    LoadMachine() {

        if (!this.ValidateCriteriaHeader()) {
            this.dlg.ShowErrorText('Please input data');
            return;
        }


        this.svc.GetDailyChecklist_Detail(this.criteriaHeader.DAILY_CHECKLIST_HID).subscribe(res => {
            // console.log(res);
            if (!res || res.length === 0) {
                this.dlg.ShowInformation('INF0001');
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

    OnEdit(data: PMS150_GetDailyChecklist_Result) {

        if (!data) { return; }
        this.criteriaHeader = data
        this.disableControl = true;

        this.LoadMachine();

    }
    OnClear() {
        this.criteria = new PMS150_Search_Criteria();
        this.checklist = null;
        this.criteriaHeader = null;
        this.InitialCriteria();
    }
    OnAddNew() {
        this.disableControl = false;
        this.criteriaHeader = new PMS150_GetDailyChecklist_Result();
    }
    BackToSearch() {
        this.criteriaHeader = null;
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
    CheckByItem(row: PMS151_GetDailyChecklist_Detail) {
        this.item = this.machineItemList.filter(e=>e.MACHINE_NO==row.MACHINE_NO)
        const dialogRef = this.popup.open(DLGPMS151_MachineItem, {
            maxWidth: '1200px',
            minHeight: '400px',
            width: '1000px',
            height: '500px',
            disableClose: false,
            position:{left:'250px'},
            data: {item:this.item}
        }


        );
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         // let data = new PMS151_GetDailyChecklist_Detail_Item[];
        //         Object.assign(this.machineItemList, result)
        //         console.log(this.machineItemList)
        //     }
        // });
    }
}