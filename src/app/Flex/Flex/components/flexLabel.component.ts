import {Component, Input, ElementRef, OnInit} from '@angular/core';
import { FlexService } from '../services/flex.service';
import { TZ_SCREEN_DETAIL_LANG_MS } from '../models/tableModel';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[flex-label-c]',
  template: `
      {{ControlCaption}}
  `
})
// tslint:disable-next-line:component-class-suffix
export class FlexLabelComponent implements OnInit {
    @Input() lid: string;
    @Input() lname: string;

    ControlCaption: string;

    constructor(private svc: FlexService, private el: ElementRef) {}

    ngOnInit() {
        // this.el.nativeElement.textContent += '✌️';
        const d = this.svc.GetScreenDetailObj(this.lid);
        if (d) {
            this.ControlCaption = d.CONTROL_CAPTION;
        } else {
            this.ControlCaption = this.lname;
            if (this.lid && this.lid.length > 0) {
                const tb: TZ_SCREEN_DETAIL_LANG_MS = new TZ_SCREEN_DETAIL_LANG_MS;
                tb.SCREEN_CD = this.svc.GetScreenObj().ScreenCd;
                tb.CONTROL_CD = this.lid;
                tb.CONTROL_CAPTION = this.lname;
                tb.CRT_BY = this.svc.getCurrentUser().USER_CD;
                tb.CRT_DATE = new Date();
                tb.CRT_MACHINE = 'Web';
                // this.svc.InsertScreenDetail(tb);
            }
        }
    }
}
