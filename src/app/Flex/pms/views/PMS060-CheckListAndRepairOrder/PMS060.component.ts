import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FlexService } from '../../../Flex/services/flex.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material';
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
import { SelectionModel } from '@angular/cdk/collections';
import { DLG045Component } from '../DLG045-ItemFindDialogWithParam/DLG045.component';
import { DLG045_Search_Criteria } from '../../models/DLG045_Search_Criteria';
import { TBM_POSITION } from '../../../Flex/models/tableModel';

@Component({
    selector: 'app-pms060',
    templateUrl: './pms060.component.html',
})
export class PMS060Component implements OnInit {

    displayedColumns: string[] = ['CLS_INFO_CD', 'CLS_CD', 'CLS_DESC', 'SEQ', 'EDIT_FLAG'];
    displayedColumnsPersonInCharge: string[] = ['SELECT', 'DISPLAY'];
    displayedColumnsChecklist: string[] = ['BTN', 'PM_CHECKLIST_DESC', 'NORMAL_CHECK_BOOL', 'PROBLEM_DESC', 'REPAIR_METHOD'];
    displayedColumnsPart: string[] = ['ACTION', 'PARTS_LOC_CD', 'PARTS_ITEM_CD', 'BTN', 'PARTS_ITEM_DESC', 'REQUEST_QTY', 'IN_QTY', 'USED_QTY', 'UNITCODE', 'REMARK'];
    displayedColumnsCrTools: string[] = ['NO', 'ITEM_CD', 'ITEM_DESC', 'UNITCODE', 'IN_QTY', 'IN_CLEAN_BOOL', 'IN_APPEARANCE_BOOL', 'OUT_USEDQTY', 'OUT_RETURNQTY', 'OUT_CLEAN_BOOL', 'OUT_APPEARANCE_BOOL'];
    displayedColumnsCrPart: string[] = ['ACTION', 'LOC_CD', 'ITEM_CD', 'BTN', 'ITEM_DESC', 'UNITCODE', 'REQUEST_QTY', 'IN_QTY', 'IN_CLEAN_BOOL', 'IN_APPEARANCE_BOOL', 'OUT_USEDQTY', 'OUT_RETURNQTY', 'OUT_CLEAN_BOOL', 'OUT_APPEARANCE_BOOL'];
    displayedColumnsCrPH: string[] = ['NO', 'PERSONAL_DESC', 'PASS'];

    dataSource: MatTableDataSource<PMS060_CheckListAndRepairOrder_Result>;
    dataSourcePersonInCharge: MatTableDataSource<PMS060_CheckJobPersonInCharge_Result>;
    dataSourcePmChecklist: MatTableDataSource<any>
    dataSourcePmParts: MatTableDataSource<any>
    dataSourceCrTools: MatTableDataSource<any>
    dataSourceCrParts: MatTableDataSource<any>
    dataSourceCrPH: MatTableDataSource<any>

    pageOptions: number[];
    isLoading: boolean;
    isDataChange: boolean;
    criteria: PMS060_Search_Criteria = new PMS060_Search_Criteria;
    dataList: PMS060_CheckListAndRepairOrder_Result[];
    data: any;
    dataFromList: PMS060_CheckListAndRepairOrder_Result;
    dataCheckList: any;
    editPmData: any;
    tempPmData: any;
    dialogData: any;

    selectedMachineComponent: string;
    // person in charge selection
    SelectedPersonInCharge: any;
    multiSelectPersonInCharge: boolean = false;
    selectionPersonInCharge = new SelectionModel<PMS060_CheckJobPersonInCharge_Result>(this.multiSelectPersonInCharge, []);

    STATUS_ACTIVE_PLAN = "F01"; // Active Plan
    STATUS_CANCEL_PLAN = "F02"; // Cancelled Plan
    STATUS_NEW = "F03"; // New Check/Repair Order
    STATUS_DURING_ASSIGN = "F04"; // During Assign
    STATUS_RECEIVED = "F05"; // Received Check/Repair Order
    STATUS_DURING_APPROVE = "F06"; // During Approve
    STATUS_REVISE = "F07"; // Revised
    STATUS_PARTIAL = "F08"; // Partial Check/Repair Order
    STATUS_COMPLETE = "F09"; // Completed Check/Repair Order
    STATUS_CANCEL = "F10"; // Cancelled Check/Repair Order


    comboUserWithPosition: ComboStringValue[];
    comboLocation: ComboStringValue[];
    comboSupplier: ComboIntValue[];
    comboSchduleType: ComboIntValue[];
    comboStatus: ComboStringValue[];
    comboMachine: ComboStringValue[];
    comboPoNumber: ComboIntValue[];
    comboMachinePeriod: ComboIntValue[];
    comboMachineComponent: ComboStringValue[];
    comboItemUnit: ComboStringValue[];
    comboPosition: TBM_POSITION[];

    rdoCheckMachineItem = [
        { DISPLAY: 'Normal', VALUE: 1 },
        { DISPLAY: 'Not Available', VALUE: 2 },
        { DISPLAY: 'Temporary Use', VALUE: 3 },
    ];
    rdoQcCheckItem = [
        { DISPLAY: 'Normal', VALUE: 1 },
        { DISPLAY: 'Not Available', VALUE: 2 },
        { DISPLAY: 'Temporary Use', VALUE: 3 },
    ];

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private dlg: DiaglogService,
        private combo: ComboService,
        private svc: PMSService,
        private flex: FlexService,
        public popup: MatDialog
    ) {
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

        this.combo.GetComboMachinePeriod().subscribe(res => {
            this.comboMachinePeriod = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboUnit(false).subscribe(res => {
            this.comboItemUnit = res;
        }, error => {
            this.dlg.ShowException(error);
        });


        this.combo.GetComboPosition().subscribe(res => {
            this.comboPosition = res;
        }, error => {
            this.dlg.ShowException(error);
        });
    }

    RemovePersonIncharge() {
        if (!this.data.PersonInCharge)
            return;

        let index: number;
        this.selectionPersonInCharge.selected.forEach(item => {
            index = this.data.PersonInCharge.findIndex(d => d === item);
            if (index > -1) {
                this.data.PersonInCharge.splice(index, 1);
            }
        });

        // set new selection
        let selected = [];
        if (index >= this.data.PersonInCharge.length)
            index = this.data.PersonInCharge.length - 1;

        if (index > -1)
            selected.push(this.data.PersonInCharge[index])

        this.dataSourcePersonInCharge = new MatTableDataSource(this.data.PersonInCharge);
        this.selectionPersonInCharge = new SelectionModel<PMS060_CheckJobPersonInCharge_Result>(this.multiSelectPersonInCharge, selected);


    }

    AddPersonIncharge() {
        if (!this.data.PersonInCharge)
            this.data.PersonInCharge = new Array();

        let selected = this.comboUserWithPosition.find(u => u.VALUE === this.SelectedPersonInCharge);
        if (!selected)
            return;

        let exists = this.data.PersonInCharge.find(u => u.PERSONINCHARGE === this.SelectedPersonInCharge);
        if (exists) {
            this.dlg.ShowWaring("VLM0771");
            return;
        }

        let item = new PMS060_CheckJobPersonInCharge_Result();
        item.DISPLAY = selected.DISPLAY
        item.PERSONINCHARGE = selected.VALUE;
        item.POSITIONID = +selected.CODE; // + mean convert to number 

        this.data.PersonInCharge.push(item);
        this.dataSourcePersonInCharge = new MatTableDataSource(this.data.PersonInCharge);

        this.SelectedPersonInCharge = null;
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

        if (data.SCHEDULE_TYPEID === 3 || data.SCHEDULE_TYPEID === 2) {
            this.InitialDialogData();
        }

        if (data.SCHEDULE_TYPEID === 3) {
            this.svc.GetCheckJobCr(data).subscribe((res) => {
                this.isLoading = false;
                this.data = res;
                this.dataSourcePersonInCharge = new MatTableDataSource(this.data.PersonInCharge);
                this.dataSourceCrTools = new MatTableDataSource(this.data.Tools);
                this.dataSourceCrParts = new MatTableDataSource(this.data.Parts);
                this.dataSourceCrPH = new MatTableDataSource(this.data.PersonalChecklist);

                this.OnMachineChange(this.data.Header.MACHINE_NO);
                this.selectedMachineComponent = this.data.DefaultComponent;
            }, error => {
                this.dlg.ShowException(error);
                this.isLoading = false;
            });
        }
        else {
            this.svc.GetCheckJob(data).subscribe((res) => {
                this.isLoading = false;
                this.data = res;
                this.dataSourcePersonInCharge = new MatTableDataSource(this.data.PersonInCharge);

                if (this.data.Header.SCHEDULE_TYPEID === 2) {
                    this.dataSourcePmChecklist = new MatTableDataSource(this.data.PmChecklist);
                    this.dataSourcePmParts = new MatTableDataSource(this.data.PmParts);

                    this.OnMachineChange(this.data.Header.MACHINE_NO);
                    this.selectedMachineComponent = this.data.DefaultComponent;

                }
            }, error => {
                this.dlg.ShowException(error);
                this.isLoading = false;
            });
        }

    }
    InitialDialogData() {
        let criteria = new DLG045_Search_Criteria();
        criteria.FilterItemCategory = null;
        criteria.FilterItemCls = ["FG"];
        criteria.MultiSelect = true;
        criteria.ShowDeleted = false;
        criteria.ShowStopItem = false;
        this.svc.GetItemFindDialogWithParam(criteria).subscribe(res => {   
            this.dialogData = res;
        }, error => {
        });
    }

    Back() {
        this.data = null;
        if (this.isDataChange === true)
            this.LoadData();
    }

    SaveOH() {
        if (this.ValidatePersonInCharge() == false)
            return;

        this.isLoading = true;
        this.data.CurrentUser = this.flex.getCurrentUser().USER_CD;
        this.svc.SaveOH(this.data).subscribe((res: string) => {
            this.isLoading = false;
            this.isDataChange = true;

            this.dlg.ShowSuccess("INF9003");

            this.dataFromList.CHECK_REPH_ID = res;
            this.OnEdit(this.dataFromList);

        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });
    }

    onCancelPM() {
        this.dlg.ShowConfirmWithRemark('CFM9002').subscribe(d => {
            if (d && d.DialogResult === 'Yes') {
                if (this.ValidatePM() == false)
                    return;

                this.isLoading = true;
                this.data.CurrentUser = this.flex.getCurrentUser().USER_CD;
                this.data.Header.CANCEL_REMARK = d.Remark;
                this.svc.CancelPM(this.data).subscribe((res: string) => {
                    this.isLoading = false;
                    this.isDataChange = true;

                    this.dlg.ShowSuccess("INF9003");

                    this.OnEdit(this.dataFromList);

                }, error => {
                    this.dlg.ShowException(error);
                    this.isLoading = false;
                });

            }
        });
    }

    onApprovePM() {
        this.dlg.ShowConfirm('CFM9021').subscribe(d => {
            if (d && d.DialogResult === 'Yes') {
                if (this.ValidatePM() == false)
                    return;

                this.isLoading = true;
                this.data.CurrentUser = this.flex.getCurrentUser().USER_CD;
                this.svc.SendToApprovePM(this.data).subscribe((res: string) => {
                    this.isLoading = false;
                    this.isDataChange = true;

                    this.dlg.ShowSuccess("INF9003");

                    this.dataFromList.CHECK_REPH_ID = res;
                    this.OnEdit(this.dataFromList);

                }, error => {
                    this.dlg.ShowException(error);
                    this.isLoading = false;
                });

            }
        });
    }

    onRevisePM() {
        this.dlg.ShowConfirmWithRemark('CFM9023').subscribe(d => {
            if (d && d.DialogResult === 'Yes') {
                if (this.ValidatePM() == false)
                    return;

                this.isLoading = true;
                this.data.CurrentUser = this.flex.getCurrentUser().USER_CD;
                this.data.Header.REVISE_REMARK = d.Remark;
                this.svc.RevisePM(this.data).subscribe((res: string) => {
                    this.isLoading = false;
                    this.isDataChange = true;

                    this.dlg.ShowSuccess("INF9003");

                    this.dataFromList.CHECK_REPH_ID = res;
                    this.OnEdit(this.dataFromList);

                }, error => {
                    this.dlg.ShowException(error);
                    this.isLoading = false;
                });

            }
        });
    }

    onSendToApprovePM() {
        this.dlg.ShowConfirm('CFM9020').subscribe(d => {
            if (d && d.DialogResult === 'Yes') {
                if (this.ValidatePM() == false)
                    return;

                this.isLoading = true;
                this.data.CurrentUser = this.flex.getCurrentUser().USER_CD;
                this.svc.SendToApprovePM(this.data).subscribe((res: string) => {
                    this.isLoading = false;
                    this.isDataChange = true;

                    this.dlg.ShowSuccess("INF9003");

                    this.dataFromList.CHECK_REPH_ID = res;
                    this.OnEdit(this.dataFromList);

                }, error => {
                    this.dlg.ShowException(error);
                    this.isLoading = false;
                });

            }
        });
    }

    SavePM() {
        if (this.ValidatePM() == false)
            return;

        this.isLoading = true;
        this.data.CurrentUser = this.flex.getCurrentUser().USER_CD;
        this.svc.SavePM(this.data).subscribe((res: string) => {
            this.isLoading = false;
            this.isDataChange = true;

            this.dlg.ShowSuccess("INF9003");

            this.dataFromList.CHECK_REPH_ID = res;
            this.OnEdit(this.dataFromList);

        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });
    }

    SaveCR() {
        if (this.ValidateCR() == false)
            return;

        this.isLoading = true;
        this.data.CurrentUser = this.flex.getCurrentUser().USER_CD;
        this.svc.SaveCR(this.data).subscribe((res: string) => {
            this.isLoading = false;
            this.isDataChange = true;

            this.dlg.ShowSuccess("INF9003");

            this.dataFromList.CHECK_REPH_ID = res;
            this.OnEdit(this.dataFromList);

        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });
    }

    ValidatePersonInCharge() {

        if (!this.data.PersonInCharge || this.data.PersonInCharge.length == 0) {
            this.dlg.ShowWaring("VLM0770"); // No slelcted Person in Charge.
            return false;
        }
    }

    ValidateCR() {
        // if (this.ValidatePersonInCharge() == false)
        //     return false;

        if (!this.data.Header.COMPLETE_DATE) {
            let item = this.data.PmParts.find(p =>
                p.USED_QTY > 0
            );
            this.dlg.ShowWaring("VLM0773");//"Test Date is required.");
            return false;
        }
    }

    ValidatePM() {
        if (this.ValidatePersonInCharge() == false)
            return false;

        if (!this.data.Header.TEST_DATE) {
            let item = this.data.PmParts.find(p =>
                p.USED_QTY > 0
            );
            this.dlg.ShowWaring("VLM0773");//"Test Date is required.");
            return false;
        }
    }

    EditPmCheckList(row) {
        this.editPmData = row;
        this.tempPmData = new Object();
        this.tempPmData.PM_CHECKLIST_DESC = row.PM_CHECKLIST_DESC;
        this.tempPmData.NORMAL_CHECK_BOOL = row.NORMAL_CHECK_BOOL;
        this.tempPmData.PROBLEM_DESC = row.PROBLEM_DESC;
        this.tempPmData.REPAIR_METHOD = row.REPAIR_METHOD;
    }

    CloseFormChecklist() {
        this.tempPmData = null;
    }

    SaveChecklist() {
        this.editPmData.NORMAL_CHECK_BOOL = this.tempPmData.NORMAL_CHECK_BOOL;
        this.editPmData.PROBLEM_DESC = this.tempPmData.PROBLEM_DESC;
        this.editPmData.REPAIR_METHOD = this.tempPmData.REPAIR_METHOD;

        this.CloseFormChecklist();
    }

    MachineComponentChange() {
        this.svc.GetComponentParts(this.selectedMachineComponent, null).subscribe(res => {
            if (!res || res.length === 0) {
                this.dlg.ShowInformation('INF0001');
            }
            this.isLoading = false;
            this.data.PmParts = res;
            this.dataSourcePmParts = new MatTableDataSource(this.data.PmParts);
        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });


    }

    MachineComponentChangeCR() {
        this.svc.GetComponentParts(this.selectedMachineComponent, null).subscribe(res => {
            if (!res || res.length === 0) {
                this.dlg.ShowInformation('INF0001');
            }
            this.isLoading = false;
            this.data.Parts=[];
            res.forEach(function (row) {
                this.data.push({
                    LOC_CD      : row.PARTS_LOC_CD,
                    ITEM_CD     : row.PARTS_ITEM_CD,
                    ITEM_DESC   : row.PARTS_ITEM_DESC,
                    IN_QTY      : row.IN_QTY,
                    UNITCODE    : row.UNITCODE
                });
            });
            this.dataSourceCrParts = new MatTableDataSource(this.data.Parts);
        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });


    }

    OnMachineChange(MACHINE_NO) {
        this.combo.GetComboMachineComponent(MACHINE_NO).subscribe(res => {
            this.comboMachineComponent = res;
        }, error => {
            this.dlg.ShowException(error);
        });
    }

    deletePart(row) {
        this.dlg.ShowConfirm('CFM0131').subscribe(d => {
            if (d && d.DialogResult === 'Yes') {

                let index = this.data.PmParts.findIndex(d => d === row);
                if (index > -1) {
                    this.data.PmParts.splice(index, 1);
                }
                this.dataSourcePmParts = new MatTableDataSource(this.data.PmParts);
            }
        });
    }

    deletePartCr(row) {
        this.dlg.ShowConfirm('CFM0131').subscribe(d => {
            if (d && d.DialogResult === 'Yes') {

                let index = this.data.Parts.findIndex(d => d === row);
                if (index > -1) {
                    this.data.Parts.splice(index, 1);
                }
                this.dataSourceCrParts = new MatTableDataSource(this.data.Parts);
            }
        });
    }

    addPart() {
        this.data.PmParts.push({});
        this.dataSourcePmParts = new MatTableDataSource(this.data.PmParts);
    }

    addPartCr() {
        this.data.Parts.push({});
        this.dataSourceCrParts = new MatTableDataSource(this.data.Parts);
    }

    openDialog(row) {
        let criteria = new DLG045_Search_Criteria();
        criteria.FilterItemCategory = null;
        criteria.FilterItemCls = ["FG"];
        criteria.MultiSelect = true;
        criteria.ShowDeleted = false;
        criteria.ShowStopItem = false;
        criteria.Data=this.dialogData;

        const dialogRef = this.popup.open(DLG045Component, {
            data: criteria
        });

        dialogRef.afterClosed().subscribe(result => {

            let pData = this.prepareResult(result);
            if (pData && pData.length > 0) {

                this.getInQty(pData);

                row.PARTS_LOC_CD = pData[0].PARTS_LOC_CD;
                row.PARTS_ITEM_CD = pData[0].PARTS_ITEM_CD;
                row.PARTS_ITEM_DESC = pData[0].PARTS_ITEM_DESC;
                row.IN_QTY = result[0].IN_QTY;
                row.UNITCODE = pData[0].UNITCODE;

                if (pData.length > 1) {
                    for (let i = 1; i < pData.length; i++) {
                        this.data.PmParts.push({
                            PARTS_LOC_CD: pData[0].PARTS_LOC_CD,
                            PARTS_ITEM_CD: pData[i].PARTS_ITEM_CD,
                            PARTS_ITEM_DESC: pData[i].PARTS_ITEM_DESC,
                            IN_QTY: pData[i].IN_QTY,
                            UNITCODE: pData[i].UNITCODE,
                        });
                    }
                    this.dataSourcePmParts = new MatTableDataSource(this.data.PmParts);
                }


            }
        });
    }
    openDialogCr(row) {
        this.isLoading = true;
        let criteria = new DLG045_Search_Criteria();
        criteria.FilterItemCategory = null;
        criteria.FilterItemCls = ["FG"];
        criteria.MultiSelect = true;
        criteria.ShowDeleted = false;
        criteria.ShowStopItem = false;
        criteria.Data=this.dialogData;

        const dialogRef = this.popup.open(DLG045Component, {
            data: criteria
        });

        dialogRef.afterClosed().subscribe(result => {
            this.isLoading = false;
            let pData = this.prepareResult(result);
            if (pData && pData.length > 0) {

                this.getInQty(pData);

                row.LOC_CD = pData[0].PARTS_LOC_CD;
                row.ITEM_CD = pData[0].PARTS_ITEM_CD;
                row.ITEM_DESC = pData[0].PARTS_ITEM_DESC;
                row.IN_QTY = result[0].IN_QTY;
                row.UNITCODE = pData[0].UNITCODE;

                if (pData.length > 1) {
                    for (let i = 1; i < pData.length; i++) {
                        this.data.PmParts.push({
                            LOC_CD: pData[0].PARTS_LOC_CD,
                            ITEM_CD: pData[i].PARTS_ITEM_CD,
                            ITEM_DESC: pData[i].PARTS_ITEM_DESC,
                            IN_QTY: pData[i].IN_QTY,
                            UNITCODE: pData[i].UNITCODE,
                        });
                    }
                    this.dataSourceCrParts = new MatTableDataSource(this.data.PmParts);
                }


            }
        });
    }
    getInQty(data: any[]) {

        this.svc.GetInQty({
            CHECK_REPH_ID: this.data.Header.CHECK_REPH_ID,
            ITEMS: data
        }).subscribe(res => {

            res.forEach(function (row) {
                let item = data.find(i =>
                    i.PARTS_ITEM_CD === row.PARTS_ITEM_CD
                    && i.PARTS_LOC_CD === row.PARTS_LOC_CD
                    && i.UNITCODE === row.UNITCODE
                );
                if (item) {
                    item.IN_QTY = row.IN_QTY
                }
            });

        }, error => {
            this.dlg.ShowException(error);
        });
    }
    prepareResult(data: any) {
        if (data && data.length > 0) {
            let result = [];
            for (let i = 0; i < data.length; i++) {
                result.push({
                    PARTS_LOC_CD: this.data.Header.MACHINE_LOC_CD,
                    PARTS_ITEM_CD: data[i].ITEM_CD,
                    PARTS_ITEM_DESC: data[i].ITEM_DESC,
                    UNITCODE: data[i].INVENTORY_UNIT,
                });
            }
            return result;
        }
        else {
            return [];
        }
    }

    GetCheckedYn(e) {
        if (e.checked === true)
            return "Y";
        else
            return "N";
    }

}
