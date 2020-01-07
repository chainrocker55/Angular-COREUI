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
        this.navItems.push({
          ScreenCd: "Test", name: "TestMenu", url: "/test",
          badge:null,
          children:{          
            badge:null,
            children:null,
            divider:false,
            icon:"fa fa-key",
            name:"Test UI",
            ScreenCd:"test001",
            title:false,
            url:"/test/test001"
          },
        
        })
        localStorage.setItem('flexMenu', JSON.stringify(data));
      }, (error: HttpErrorResponse) => {
        this.dlg.ShowException(error);
      });
      this.GetNoti(true);
      this.interval = setInterval(() => {
        this.GetNoti(false);
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

  GetNoti(isFirst: boolean) {
    this.svc.GetNotiy().subscribe(res => {
      if (!isFirst) {
        if (!this.noti) {
          this.noti = [];
        }
        const n = this.noti;
        const r = res.filter(function(value) {
          return value.HasRead === false;
        });
        const n_new = [];
        r.forEach(function(value) {
          let found = false;
          n.forEach(function(valuen) {
            if (value.Seq === valuen.Seq) {
              found = true;
            }
          })
          if (!found) {
            n_new.push(value);
          }
        });
        const d = this.dlg;
        if (n_new.length > 0) {
          n_new.forEach(function(value) {
            d.ShowInformationText(value.Description);
          });
        }
      }
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
        this.noti = this.noti.filter(function(value) {
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
