import { Component, OnInit  } from '@angular/core';
import { SystemService } from '../../services/system.service';
import { DiaglogService } from '../../../Flex/services/Dialog.service';
import { TZ_USER_GROUP_MS } from '../../../Flex/models/tableModel';

@Component({
  selector: 'app-sfm006',
  templateUrl: './SFM006.component.html',
})
export class SFM006Component implements OnInit {

    obj: any;

  constructor(private svc: SystemService, private dlg: DiaglogService) {
      this.obj = {};
  }

  ngOnInit() {
    this.LoadData();
  }

  LoadData() {
      this.svc.GetUserGroupList().subscribe(res => {
          this.obj.Result = res;
      }, error => {
          this.dlg.ShowException(error);
      });
  }

  OnEdit(data: TZ_USER_GROUP_MS) {
      this.obj.SelectedData = data;
      this.svc.sp_SFM0061_GetPermission(data.GROUP_CD).subscribe(res => {
          this.obj.Screen = res;
      }, error => {
          this.dlg.ShowException(error);
      });
  }
  OnEditScreen(data) {
      this.obj.SelectedScreen = data;
      console.log(data);
  }
}
