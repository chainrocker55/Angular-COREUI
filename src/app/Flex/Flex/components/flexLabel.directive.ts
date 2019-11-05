import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { FlexService } from '../services/flex.service';
import { TZ_SCREEN_DETAIL_LANG_MS } from '../models/tableModel';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[flexLabel]'
})

export class FlexLabelDirective implements OnInit {

    @Input('flexLabel') controlcd: string;

    constructor(private el: ElementRef, private svc: FlexService) {
    }

    ngOnInit() {
      //  el.nativeElement.style.backgroundColor = 'yellow';
      // el.nativeElement.textContent += '✌️';
      const d = this.svc.GetScreenDetailObj(this.controlcd);
      if (d) {
        this.el.nativeElement.textContent = d.CONTROL_CAPTION;
      } else {
          if (this.controlcd && this.controlcd.length > 0) {
              const tb: TZ_SCREEN_DETAIL_LANG_MS = {
                CONTROL_CD: this.controlcd,
                LANG_CD: 'en-US',
                SCREEN_CD: this.svc.GetScreenObj().ScreenCd,
                CONTROL_CAPTION: this.el.nativeElement.textContent.trim(),
                CRT_BY: this.svc.getCurrentUser().USER_CD,
                CRT_DATE: new Date,
                CRT_MACHINE: 'Web',
                UPD_BY: this.svc.getCurrentUser().USER_CD,
                UPD_DATE: new Date,
                UPD_MACHINE: 'Web',
                IS_USED: 1,
              };
              this.svc.InsertScreenDetail(tb);
          }
      }
    }
}
