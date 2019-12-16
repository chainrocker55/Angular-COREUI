import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { MatPaginator } from '@angular/material/paginator';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { ComboStringValue, ComboIntValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';
import { PMSService } from '../../services/pms.service';
import { DLG045_Search_Criteria } from '../../models/DLG045_Search_Criteria';
import { DLG045Component } from '../DLG045-ItemFindDialogWithParam/DLG045.component';

@Component({
    selector: 'app-dlgpms062_01',
    templateUrl: './DLGPMS062_01.component.html',
    // styleUrls: ['./dialog-box.component.css']
})
export class DLGPMS062_01Component {

    comboItemUnit: ComboStringValue[];
    comboLocation: ComboStringValue[];

    originalData: any;
    data: any;
    list: any;
    parts: any;
    CHECK_REPH_ID: any;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private svc: PMSService,
        private dlg: DiaglogService,
        private combo: ComboService,
        public popup: MatDialog,
        public dialogRef: MatDialogRef<DLGPMS062_01Component>,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public param: any) {

        this.originalData= { ...param.item };
        this.data = { ...param.item };
        this.list = param.list;
        this.parts = param.parts;
        this.CHECK_REPH_ID = param.CHECK_REPH_ID;


        if (!this.data)
            this.data = {};

        if(!this.parts)
        this.parts=[];
    }

    ngOnInit() {
        this.InitialCombo();
    }

    InitialCombo() {
        this.combo.GetComboLocation().subscribe(res => {
            this.comboLocation = res;
        }, error => {
            this.dlg.ShowException(error);
        });

        this.combo.GetComboItemUnit_Stock(this.data.PARTS_ITEM_CD, false).subscribe(res => {
            this.comboItemUnit = res;
        }, error => {
            this.dlg.ShowException(error);
        });
    }



    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    save() {
        if (this.data.PARTS_ITEM_CD != this.originalData.PARTS_ITEM_CD) {
            if (this.PartsExists(this.data.PARTS_ITEM_CD)) {
                this.dlg.ShowWaring("VLM0010");
                return;
            }
        }
        this.dialogRef.close(this.data);
    }

    PartsExists(PARTS_ITEM_CD: string) {
        let item = this.parts.find(p => p.PARTS_ITEM_CD == PARTS_ITEM_CD)
        if (item)
            return true;
        else
            return false;
    }

    openDialog() {
        let row = this.data;
        let criteria = new DLG045_Search_Criteria();
        criteria.FilterItemCategory = null;
        criteria.FilterItemCls = ["FG"];
        criteria.MultiSelect = false;
        criteria.ShowDeleted = false;
        criteria.ShowStopItem = false;
        criteria.Data = this.list;

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

                // if (pData.length > 1) {
                //     for (let i = 1; i < pData.length; i++) {
                //         this.data.PmParts.push({
                //             PARTS_LOC_CD: pData[0].PARTS_LOC_CD,
                //             PARTS_ITEM_CD: pData[i].PARTS_ITEM_CD,
                //             PARTS_ITEM_DESC: pData[i].PARTS_ITEM_DESC,
                //             IN_QTY: pData[i].IN_QTY,
                //             UNITCODE: pData[i].UNITCODE,
                //         });
                //     }
                //     this.dataSourcePmParts = new MatTableDataSource(this.data.PmParts);
                // }

                this.combo.GetComboItemUnit_Stock(row.PARTS_ITEM_CD, false).subscribe(res => {
                    this.comboItemUnit = res;
                }, error => {
                    this.dlg.ShowException(error);
                });


            }
        });


    }

    prepareResult(data: any) {
        if (data && data.length > 0) {
            let result = [];
            for (let i = 0; i < data.length; i++) {
                result.push({
                    PARTS_LOC_CD: this.data.PARTS_LOC_CD,
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

    getItemInQty()
    {
        this.getInQty([this.data]);
    }

    getInQty(data: any[]) {

        this.svc.GetInQty({
            CHECK_REPH_ID: this.CHECK_REPH_ID,
            ITEMS: data
        }).subscribe(res => {
            // console.log(res);
            data.forEach(function (row) {
                let item = res.find(i =>
                    i.PARTS_ITEM_CD === row.PARTS_ITEM_CD
                    && i.PARTS_LOC_CD === row.PARTS_LOC_CD
                    && i.UNITCODE === row.UNITCODE
                );
                if (item) {
                    row.IN_QTY = item.ISSUE_INVQTY
                }
                else
                {
                    row.IN_QTY=0;
                }
            });

        }, error => {
            this.dlg.ShowException(error);
        });
    }

    onPartChange() {

        let item = this.list.find(x => x.ITEM_CD.toLowerCase() == this.data.PARTS_ITEM_CD.toLowerCase());
        
        if (!item) {
            this.dlg.ShowWaring("VLM0440");
            item = {};
        }
        // else if (PartsExists(item.ITEM_CD, e.RowIndex))
        // {
        //     MessageDialogUtil.ShowBusiness(this, MessageCode.eValidate.VLM0010);
        //     mPartData[e.RowIndex].PARTS_ITEM_CD = null;
        //     LoadPartIntoRow(e.RowIndex, null);
        //     return;
        // }


        this.data.PARTS_ITEM_CD = item.ITEM_CD;
        this.data.PARTS_ITEM_DESC = item.ITEM_DESC;
        this.data.UNITCODE = item.INVENTORY_UNIT;

        this.getItemInQty();

        this.combo.GetComboItemUnit_Stock(item.ITEM_CD, false).subscribe(res => {
            this.comboItemUnit = res;
        }, error => {
            this.dlg.ShowException(error);
        });
    }

}
