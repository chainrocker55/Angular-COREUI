import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MatPaginator } from '@angular/material/paginator';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { ComboStringValue, ComboIntValue } from '../../../Flex/models/complexModel';
import { ComboService } from '../../../Flex/services/combo.service';
import { PMSService } from '../../services/pms.service';

@Component({
    selector: 'app-dlgpms062_01',
    templateUrl: './DLGPMS062_01.component.html',
    // styleUrls: ['./dialog-box.component.css']
})
export class DLGPMS062_01Component {

    comboItemUnit: ComboStringValue[];
    comboLocation: ComboStringValue[];
    
    data : any={};

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private svc: PMSService,
        private dlg: DiaglogService,
        private combo: ComboService,
        public dialogRef: MatDialogRef<DLGPMS062_01Component>,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public param: any) {
            console.log(param);
            this.data=param;
            if(this.data==null)
                this.data={};
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

        this.combo.GetComboUnit(false).subscribe(res => {
            this.comboItemUnit = res;
        }, error => {
            this.dlg.ShowException(error);
        });
    }

  

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    save()
    {
        this.dialogRef.close(this.data);
    }

}
