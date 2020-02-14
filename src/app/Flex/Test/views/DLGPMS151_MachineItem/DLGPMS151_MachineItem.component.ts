import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MatTableDataSource } from '@angular/material/table';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PMSDailyChecklistService } from '../../services/PMS_DailyChecklist.service';
import { PMS151_GetDailyChecklist_Detail_Item } from '../../models/PMS151_GetDailyChecklist_Detail_Item';
import { ComboIntValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';

@Component({
    selector: 'app-dlg151PMS',
    templateUrl: './DLGPMS151_MachineItem.component.html',
    // styleUrls: ['./dialog-box.component.css']
})
export class DLGPMS151_MachineItem {

    action: string;
    dataList: any;
    isLoading: boolean;


    displayedColumns: string[] = ['NO', 'CHECKLISTITEM_DESC','OK','NG', 'NG_REASON','REMARK'];
    dataSourceMachineItem: MatTableDataSource<any>;

    comboNGReason: ComboIntValue[];

    comboIntAllItem: ComboIntValue = {
        VALUE: -1,
        CODE: undefined,
        DISPLAY: 'Select NG Reason'
    };

    constructor(
        private svc: PMSDailyChecklistService,
        private dlg: DiaglogService,
        public dialogRef: MatDialogRef<DLGPMS151_MachineItem>,
        private combo: ComboService,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public param: any) {

            this.dataList = param.item;
            // this.dataSourceMachineItem = new MatTableDataSource(this.dataList);

        }
    

    ngOnInit() {
      
        if (this.dataList) {
            this.dataSourceMachineItem = new MatTableDataSource(this.dataList);
            this.InitialCombo()
            console.log(this.dataSourceMachineItem)
        }
    }
    InitialCombo() {

        this.combo.GetComboShiftTypeDayNight().subscribe(res => {
            res.splice(0, 0, this.comboIntAllItem);
            this.comboNGReason = res;
        }, error => {
            this.dlg.ShowException(error);
        });



    }

   

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }


}
