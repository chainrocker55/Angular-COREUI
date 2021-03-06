import { Component, OnInit } from '@angular/core';
import { FlexService } from '../../Flex/Flex/services/flex.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DiaglogService } from '../../Flex/Flex/services/Dialog.service';
import { UserInfo } from '../../Flex/Flex/models/complexModel';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  flexUserCd: string;
  isLoading: boolean;

  constructor(private router: Router, private svc: FlexService, private dlg: DiaglogService) {

  }

  ngOnInit() {
    if (this.svc.getToken() !== null) {
      this.router.navigate(['/']);
    }
    this.flexUserCd = localStorage.getItem('flexUserCd');
  }

  Login(form) {
    this.isLoading = true;
    this.svc.login(form.value.userCd, form.value.passWord).subscribe((user: UserInfo) => {
      if (user && user.TOKEN) {
        this.dlg.ShowInformationText('Login success');
        localStorage.removeItem('flexToken');
        localStorage.setItem('flexToken', user.TOKEN);
        localStorage.setItem('flexUserCd', user.USER_CD);

        if (this.svc.GetDataToLocal()) {
          this.router.navigate(['/']);
          this.isLoading = false;
        }
      }
  },
  (error: HttpErrorResponse) => {
    this.dlg.ShowException(error);
    this.isLoading = false;
  });
  }
}
