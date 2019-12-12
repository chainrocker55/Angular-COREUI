import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';

import { MatPaginator } from '@angular/material/paginator';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { PMSService } from '../../services/pms.service';

@Component({
    selector: 'app-dlgpms002',
    templateUrl: './DLGPMS002.component.html',
    // styleUrls: ['./dialog-box.component.css']
})
export class DLGPMS002Component {

    MACHINE_NO: string;
    list: any[];
    dataSource: any;
    displayedColumns: string[] = ['FILE_NAME'];


    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private svc: PMSService,
        private dlg: DiaglogService,
        public dialogRef: MatDialogRef<DLGPMS002Component>,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public param: any) {
        this.MACHINE_NO = param.MACHINE_NO;
        this.list=param.list;
    }

    ngOnInit() {
        this.LoadData();
    }

    LoadData() {
        if(this.list)
        {
            this.dataSource = new MatTableDataSource(this.list);
        }
        else
        {
        this.svc.LoadMachineAttachment(this.MACHINE_NO).subscribe(res => {
            this.dataSource = new MatTableDataSource(res);
        }, error => {
            this.dlg.ShowException(error);
        });
    }
    }


    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    save() {
        this.dialogRef.close(null);
    }

    openFile(attachment)
    {
        // window.open("file:" + attachment.PhysicalName, "_blank");
        window.open(this.svc.DownloadAttachment(attachment.FILEHID, attachment.FILEID));
    }

}
