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

@Component({
    selector: 'app-pms060',
    templateUrl: './pms060.component.html',
})
export class PMS060Component implements OnInit {

    displayedColumns: string[] = ['CLS_INFO_CD', 'CLS_CD', 'CLS_DESC', 'SEQ', 'EDIT_FLAG'];
    displayedColumnsPersonInCharge: string[] = ['SELECT', 'DISPLAY'];
    displayedColumnsChecklist: string[] = ['BTN', 'PM_CHECKLIST_DESC', 'NORMAL_CHECK_BOOL', 'PROBLEM_DESC', 'REPAIR_METHOD'];
    displayedColumnsPart: string[] = ['ACTION', 'PARTS_LOC_CD', 'PARTS_ITEM_CD', 'BTN', 'PARTS_ITEM_DESC', 'REQUEST_QTY', 'IN_QTY', 'USED_QTY', 'UNITCODE', 'REMARK'];

    dataSource: MatTableDataSource<PMS060_CheckListAndRepairOrder_Result>;
    dataSourcePersonInCharge: MatTableDataSource<PMS060_CheckJobPersonInCharge_Result>;
    dataSourcePmChecklist: MatTableDataSource<any>
    dataSourcePmParts: MatTableDataSource<any>

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

    selectedMachineComponent: string;
    // person in charge selection
    SelectedPersonInCharge: any;
    multiSelectPersonInCharge: boolean = false;
    selectionPersonInCharge = new SelectionModel<PMS060_CheckJobPersonInCharge_Result>(this.multiSelectPersonInCharge, []);



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

    Back() {
        this.data = null;
        if (this.isDataChange === true)
            this.LoadData();
    }

    SaveOH() {
        if (this.ValidateOH() == false)
            return;

        this.isLoading = true;
        this.data.CurrentUser=this.flex.getCurrentUser().USER_CD;
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

    SavePM() {
        if (this.ValidatePM() == false)
            return;

        this.isLoading = true;
        this.data.CurrentUser=this.flex.getCurrentUser().USER_CD;
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

    ValidateOH() {

        if (!this.data.PersonInCharge || this.data.PersonInCharge.length == 0) {
            this.dlg.ShowWaring("VLM0770"); // No slelcted Person in Charge.
            return false;
        }
    }

    ValidatePM()
    {
        if(this.ValidateOH()==false)
            return false;

        if(!this.data.Header.TEST_DATE)
        {
            let item= this.data.PmParts.find(p =>
                p.USED_QTY>0
            );
            this.dlg.ShowWaring("Test Date is required.");
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

    addPart() {
        this.data.PmParts.push({});
        this.dataSourcePmParts = new MatTableDataSource(this.data.PmParts);
    }

    openDialog(row) {
        let criteria = new DLG045_Search_Criteria();
        criteria.FilterItemCategory = null;
        criteria.FilterItemCls = ["FG"];
        criteria.MultiSelect = true;
        criteria.ShowDeleted = false;
        criteria.ShowStopItem = false;

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
    getInQty(data: any[]) {

        this.svc.GetInQty({
            CHECK_REPH_ID: this.data.Header.CHECK_REPH_ID,
            ITEMS: data
        }).subscribe(res => {

            console.log(res);
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

}
