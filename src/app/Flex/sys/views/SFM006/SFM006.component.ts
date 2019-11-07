import { Component, OnInit  } from '@angular/core';
import { SystemService } from '../../services/system.service';
import { DiaglogService } from '../../../Flex/services/Dialog.service';

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
}
