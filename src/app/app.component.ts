import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet><ngx-loading-bar></ngx-loading-bar>'
})

export class AppComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  /////////////////////// disable mouse wheel on input number /////////////////////
  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.disableScroll(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.disableScroll(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.disableScroll(event);
  }

  disableScroll(event: any) {
    if (event.srcElement.type === "number") {
      // console.log(event);
      event.preventDefault();
    }
  }
  //////////////////////////////////////////////////////////////////////////////////

  // select all on focus
  @HostListener('focusin', ['$event']) selectAll(event: any) {
    try {
      // console.log(event);
      event.srcElement.select();
    }
    catch (err) {

    }
  }

}
