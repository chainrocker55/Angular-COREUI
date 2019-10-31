import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
// import { navItems } from '../../_nav';
import { FlexService } from '../../Flex/Flex/services/flex.service';
import { Router } from '@angular/router';
import { UserInfo, Notify } from '../../Flex/Flex/models/complexModel';
import { HttpErrorResponse } from '@angular/common/http';
import { DiaglogService } from '../../Flex/Flex/services/Dialog.service';
import { timer, Observable } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public navItems = [];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  public mUser: UserInfo;

  public noti: Notify[];
  public notiRead: Notify[];
  interval;

  constructor(private router: Router, private svc: FlexService, private dlg: DiaglogService, @Inject(DOCUMENT) _document?: any) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnInit(): void {
    if (this.svc.isAuthenticated()) {
      this.mUser = this.svc.getCurrentUser();
      this.svc.GetMenu().subscribe(data => {
        this.navItems = data;
        localStorage.setItem('flexMenu', JSON.stringify(data));
      }, (error: HttpErrorResponse) => {
        this.dlg.ShowException(error);
      });
      this.GetNoti();
      this.interval = setInterval(() => {
        this.GetNoti();
      }, 60 * 1000);
    }
    console.clear();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.changes.disconnect();
  }

  LogOut() {
    this.svc.logout();
  }

  Profile() {
    this.router.navigate(['system']);
  }

  GetNoti() {
    this.svc.GetNotiy().subscribe(res => {
      this.noti = res.filter(function(value) {
        return value.HasRead === false;
      });
      this.notiRead = res.filter(function(value) {
        return value.HasRead === true;
      });
    }, (error: HttpErrorResponse) => {
      this.dlg.ShowException(error);
    });
  }

  Response(n: Notify) {
    this.svc.ResponseNotify(n).subscribe(res => {
      if (res) {
        this.noti = this.noti.filter(function(value, index, arr) {
          return value !== n;
        });
        n.HasRead = true;
        this.notiRead.push(n);
      }
    }, (error: HttpErrorResponse) => {
      this.dlg.ShowException(error);
    });
  }
}
