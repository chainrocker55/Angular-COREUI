import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Observable } from 'rxjs';
import { FlexService } from '../../../Flex/services/flex.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
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
import { DLG045_Search_Criteria } from '../../models/DLG045_Search_Criteria';

@Component({
    selector: 'app-dlg045',
    templateUrl: './dlg045.component.html',
    // styleUrls: ['./dialog-box.component.css']
})
export class DLG045Component {

    action: string;
    dataList: any;
    isLoading: boolean;
    multiSelect: boolean = false;
    selection :SelectionModel<any>;

    displayedColumns: string[] = ['SELECT', 'ITEM_CD', 'ITEM_DESC', 'ITEM_CLS_DESC', 'ITEMCATEGORY_DESC', 'ITEMCONDITION_DESC', 'ITEMTYPE_DESC', 'LOT_CONTROL_CLS_DESC', 'CONSUMTION_CLS_DESC', 'INVENTORY_UNIT', 'PURCHASE_UNIT', 'SALES_UNIT', 'STOCK_UNIT'];
    dataSource: MatTableDataSource<PMS060_CheckJobPersonInCharge_Result>;


    constructor(
        private svc: PMSService,
        private dlg: DiaglogService,
        private combo: ComboService,
        public dialogRef: MatDialogRef<DLG045Component>,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public criteria: DLG045_Search_Criteria) {

        if (criteria) {
            this.multiSelect = criteria.MultiSelect;
        }

        this.selection =new SelectionModel<any>(this.multiSelect, []);
    }

    ngOnInit() {
        this.dataList=this.criteria.Data;
        if(this.dataList)
        {
            this.dataSource = new MatTableDataSource(this.dataList);
        }
        else
        {
            this.loadData();
        }
    }

    loadData() {
        this.svc.GetItemFindDialogWithParam(this.criteria).subscribe(res => {
            if (!res || res.length === 0) {
                this.dlg.ShowInformation('INF0001');
            }
            this.isLoading = false;
           
            this.dataList = res;
            this.dataSource = new MatTableDataSource(this.dataList);
        }, error => {
            this.dlg.ShowException(error);
            this.isLoading = false;
        });

        
    }

    selectItem() {
        this.dialogRef.close({ event: this.action, data: this.selection });
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

}
