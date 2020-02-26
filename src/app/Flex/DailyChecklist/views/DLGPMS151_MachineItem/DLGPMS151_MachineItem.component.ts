import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MatTableDataSource } from '@angular/material/table';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PMSDailyChecklistService } from '../../services/PMS_DailyChecklist.service';
import { PMS151_GetDailyChecklist_Detail_Item } from '../../models/PMS151_GetDailyChecklist_Detail_Item';
import { ComboIntValue, ComboStringValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';

@Component({
    selector: 'app-dlg151PMS',
    templateUrl: './DLGPMS151_MachineItem.component.html',
    styleUrls:['../Style.css']
})
export class DLGPMS151_MachineItem {

    action: string;
    dataList: any;
    isLoading: boolean;


    displayedColumns: string[] = ['NO', 'CHECKLISTITEM_DESC','OK','NG', 'NG_REASON','REMARK'];
    dataSourceMachineItem: MatTableDataSource<any>;

    comboNGReason: ComboStringValue[];

    disabledNG: Boolean = true;
    checkall: Boolean ;

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
           // this.ValidateCheckAll();
        }
    }
    InitialCombo() {

        this.combo.GetComboByClsInfoCD("NG_REASON").subscribe(res => {
            //res.splice(0, 0, this.comboIntAllItem);
            this.comboNGReason = res;
        }, error => {
            this.dlg.ShowException(error);
        });



    }
    BackToSearch(){
        //this.dataList = null;
        this.dialogRef.close({ event: 'Cancel'});
    }
   

    Onsave() {
        this.dialogRef.close({data:this.dataList, event: 'Save' });
    }

    OnCheckAll() {
        if (this.checkall == true) {    
            this.dataList.map(e => { e.OK = true, e.REMARK = null, e.NG = false, e.NG_REASON = null, e.CHECK_FLAG = "O" })
        } 


        // if((isOK||isNOT_USED||data.NG) == false){
        //     data.CHECK_FLAG = null
        //     this.machineItemList.map(e => { e.OK = false, e.REMARK = null, e.NG = false, e.NG_REASON = null, e.CHECK_FLAG = null })
        // }
    }
    ValidateCheckAll() {
        var flag = this.dataList.find(e => e.OK == false)
        if (!flag) {
            this.checkall = true;
        }
        else{
            this.checkall = false;
        }
    }
    OnCheckedOK(row:PMS151_GetDailyChecklist_Detail_Item){
        if(row.OK == true){
            row.NG = false;
            row.NG_REASON = null;
            row.OK = true;
            row.CHECK_FLAG = 'O';
        }else{
            row.NG = false;
            row.NG_REASON = null;
            row.OK = false;
            row.CHECK_FLAG = null;
        }
        this.ValidateCheckAll();

    }
    OnCheckedNG(row:PMS151_GetDailyChecklist_Detail_Item){
        if(row.NG_REASON){
            row.OK = false;
            row.NG = true;
            this.dataList.map(e => e.CHECK_FLAG = 'G')
        }
        this.ValidateCheckAll();
    }



}
