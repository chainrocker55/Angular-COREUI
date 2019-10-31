import { Component, OnInit, ViewChild  } from '@angular/core';
import { SystemService } from '../../services/system.service';
import { Observable } from 'rxjs';
import { FlexService } from '../../../Flex/services/flex.service';
import { ComboService } from '../../../Flex/services/combo.service';
import { TZ_USER_MS, TZ_LANG_MS } from '../../../Flex/models/tableModel';

@Component({
  selector: 'app-sfm0035',
  templateUrl: './SFM0035.component.html',
})
export class SFM0035Component implements OnInit {

  user: TZ_USER_MS;
  comboLang: TZ_LANG_MS[];

  constructor(private combo: ComboService, private flex: FlexService) {
  }

  ngOnInit() {
    this.InitialCombo();
    this.LoadData();
  }

  InitialCombo() {
    this.combo.GetComboLanguage().subscribe(res => {
      this.comboLang = res;
    });
  }

  LoadData() {
    this.flex.GetUserProfile().subscribe(res => {
      this.user = res;
    });
  }
}
