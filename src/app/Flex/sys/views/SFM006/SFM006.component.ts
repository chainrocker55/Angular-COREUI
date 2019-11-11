import { Component, OnInit  } from '@angular/core';
import { SystemService } from '../../services/system.service';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { TZ_USER_GROUP_MS } from '../../../Flex/models/tableModel';
import { FlexService } from '../../../Flex/services/flex.service';

@Component({
  selector: 'app-sfm006',
  templateUrl: './SFM006.component.html',
})
export class SFM006Component implements OnInit {

    obj: any;

  constructor(private svc: SystemService, private dlg: DiaglogService, private flex: FlexService) {
      this.obj = {};
  }

  ngOnInit() {
    this.LoadData();
    console.log(this.flex.ActivePermission('BMM011'));
  }

  LoadData() {
      this.svc.GetUserGroupList().subscribe(res => {
          this.obj.Result = res;
      }, error => {
          this.dlg.ShowException(error);
      });
  }

  OnEdit(data: TZ_USER_GROUP_MS) {
    if (!data) { return; }
    if (this.obj.SelectedData && data.GROUP_CD === this.obj.SelectedData.GROUP_CD) { return; }

    this.obj.SelectedData = data;
    this.svc.sp_SFM0061_GetPermission(data.GROUP_CD).subscribe(res => {
        this.obj.Screen = res;
        this.obj.SelectedScreen = null;
    }, error => {
        this.dlg.ShowException(error);
    });
  }
  OnEditScreen(data) {
    if (!data) { return; }
    if (this.obj.SelectedScreen && data.SCREEN_CD === this.obj.SelectedScreen.SCREEN_CD) { return; }

    this.obj.SelectedScreen = data;
  }
  OnClick(data) {
      data.CAN_EXECUTE = !data.CAN_EXECUTE;
      this.OnChecked(data);
  }
  OnChecked(data) {
      data.CAN_EXECUTE = data.CAN_EXECUTE === true ? 1 : 0;
      data.GROUP_CD = this.obj.SelectedData.GROUP_CD;
      this.svc.UpdatePermission(data).subscribe(res => {
          this.dlg.ShowProcessComplete();
      }, error => {
          this.dlg.ShowException(error);
      });
  }
}
