import { Directive, ElementRef, Input, OnInit, NgModule } from '@angular/core';

// @NgModule({
//   declarations: [FlexLabelDirective],
//   exports: [FlexLabelDirective]
// })

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[flex-label]'
})
export class FlexLabelDirective implements OnInit {

  // @Input('flexLabel') controlCd: string;
  // @Input('flexLabel') flexText: string;
  @Input() code: string;

  constructor(private el: ElementRef) {}

   ngOnInit() {
    this.el.nativeElement.textContent += '✌️';
  }
}
