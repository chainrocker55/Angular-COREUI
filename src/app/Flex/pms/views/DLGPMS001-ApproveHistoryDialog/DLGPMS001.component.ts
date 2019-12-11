import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';

import { MatPaginator } from '@angular/material/paginator';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { PMSService } from '../../services/pms.service';

@Component({
    selector: 'app-dlgpms001',
    templateUrl: './DLGPMS001.component.html',
    // styleUrls: ['./dialog-box.component.css']
})
export class DLGPMS001Component {

    CHECK_REPH_ID: any;
    dataSource: any = [];
    displayedColumns: string[] = ['NO', 'APPROVE_USER', 'APPROVE_LEVEL', 'APPROVE_STATUS'];


    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private svc: PMSService,
        private dlg: DiaglogService,
        public dialogRef: MatDialogRef<DLGPMS001Component>,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public param: any) {
        this.CHECK_REPH_ID = param.CHECK_REPH_ID;
    }

    ngOnInit() {
        this.LoadData();
    }

    LoadData() {
        this.svc.LoadApproveHistory(this.CHECK_REPH_ID).subscribe(res => {
            this.dataSource = new MatTableDataSource(res);
        }, error => {
            this.dlg.ShowException(error);
        });
    }


    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    save() {
        this.dialogRef.close(null);
    }

}
