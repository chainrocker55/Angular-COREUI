import { Injectable, Component, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FlexService } from './flex.service';
import { MatDialog , MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export class DialogData {
  DialogResult: string;
  Remark: string;
  MSG_DESC: string;
  ShowRemark: boolean;
  ShowNo: boolean;
}
export class Exception {
  Source: string;
  Message: string;
}

@Injectable({ providedIn: 'root' })
export class DiaglogService {

  private baseUrl =  environment.baseUrl + '/flex/';

  constructor(private toastr: ToastrService, private svc: FlexService, public dialog: MatDialog) {
  }

  ShowProcessComplete() {
      const msg = this.svc.GetMessageObj('INF9003');
      this.toastr.success(msg.MSG_DESC);
  }

  ShowInformation(MSG_CD: string) {
    const msg = this.svc.GetMessageObj(MSG_CD);
    if (msg) {
        this.toastr.info(msg.MSG_DESC);
    } else {
        this.toastr.info(MSG_CD);
    }
  }
  ShowInformationText(MSG_DESC: string, Title?: string) {
    this.toastr.info(MSG_DESC, Title);
  }

  ShowSuccess(MSG_CD: string) {
    const msg = this.svc.GetMessageObj(MSG_CD);
    if (msg) {
        this.toastr.success(msg.MSG_DESC);
    } else {
        this.toastr.success(MSG_CD);
    }
  }
  ShowSuccessText(MSG_DESC: string, Title?: string) {
    this.toastr.success(MSG_DESC, Title);
  }

  ShowWaring(MSG_CD: string) {
    const msg = this.svc.GetMessageObj(MSG_CD);
    if (msg) {
        this.toastr.warning(msg.MSG_DESC);
    } else {
        this.toastr.warning(MSG_CD);
    }
  }
  ShowWaringText(MSG_DESC: string, Title?: string) {
    this.toastr.warning(MSG_DESC, Title);
  }

  ShowError(MSG_CD: string) {
      const msg = this.svc.GetMessageObj(MSG_CD);
      if (msg) {
          this.toastr.error(msg.MSG_DESC);
      } else {
          this.toastr.error(MSG_CD);
      }
  }
  ShowErrorText(MSG_DESC: string, Title?: string) {
    this.toastr.error(MSG_DESC, Title);
  }

  ShowException(ex: HttpErrorResponse) {
    console.log('Error', ex);
    if (ex.status === 400) {
      this.ShowWaring(ex.error);
    } else {
      const e = this.GetException(ex);
      this.toastr.error(e.Message, e.Source, {
        timeOut: 10 * 1000
      });
    }
  }
  GetException(ex: HttpErrorResponse): Exception {
    if (!ex) { return new Exception(); }
    if (ex.status === 500) {
      const er = ex.error.toString();
      const s = er.substring(0, er.indexOf(':'));
      const m = er.substring(er.indexOf(':') + 2, er.indexOf('\n'));

      const e: Exception = {
        Source: s,
        Message: m,
      };
      return e;
    } else if (ex.status === 400) {
      const e: Exception = {
        Source: ex.statusText,
        Message: ex.error,
      };
      return e;
    } else {
      const e: Exception = {
        Source: ex.statusText,
        Message: ex.message,
      };
      return e;
    }
  }

  ShowConfirm(MSG_CD: string): Observable<DialogData> {
    const m = this.svc.GetMessageObj(MSG_CD);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        MSG_DESC: m ? m.MSG_DESC : MSG_CD,
        ShowRemark: false,
        ShowNo: false,
      }
    });
    return dialogRef.afterClosed();
  }
  ShowConfirmYesNo(MSG_CD: string): Observable<DialogData> {
    const m = this.svc.GetMessageObj(MSG_CD);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        MSG_DESC: m ? m.MSG_DESC : MSG_CD,
        ShowRemark: false,
        ShowNo: true,
      }
    });
    return dialogRef.afterClosed();
  }
  ShowConfirmWithRemark(MSG_CD: string): Observable<DialogData> {
    const m = this.svc.GetMessageObj(MSG_CD);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        MSG_DESC: m ? m.MSG_DESC : MSG_CD,
        ShowRemark: true,
        ShowNo: false,
      }
    });
    return dialogRef.afterClosed();
  }
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'flexConfirmDialog',
  templateUrl: '../components/dialog/confirm-dialog.component.html',
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onYesClick(): void {
    this.data.DialogResult = 'Yes';
  }
  onNoClick(): void {
    this.data.DialogResult = 'No';
  }
  onCancelClick(): void {
    this.data.DialogResult = 'Cancel';
  }

}
