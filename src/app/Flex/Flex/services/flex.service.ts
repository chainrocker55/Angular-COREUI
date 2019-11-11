import { Injectable } from '@angular/core';
import { HttpClient, JsonpInterceptor, HttpErrorResponse } from '@angular/common/http';

import { Observable, observable, Observer } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { NavData } from '../../../_nav';
import { RouterLinkWithHref, Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { ObserveOnMessage } from 'rxjs/internal/operators/observeOn';
import { UserInfo, Notify, ActivePermissionValue } from '../models/complexModel';
import { TZ_MESSAGE_MS, TZ_SCREEN_DETAIL_LANG_MS, TZ_USER_MS } from '../models/tableModel';

@Injectable({ providedIn: 'root' })
export class FlexService {

  private baseUrl =  environment.baseUrl + '/flex/';  // URL to web api
  private authBaseUrl = environment.baseUrl + '/auth';

  constructor(private router: Router, private http: HttpClient) {
  }

    login (userCd: string, passWord: string): Observable<UserInfo> {
        return this.http.post<UserInfo>(this.authBaseUrl, {
            UserCd: userCd,
            Password: passWord,
        });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('flexToken');
        this.router.navigate(['login']);
    }

    isAuthenticated (): boolean {
        const token = this.getToken();
        const isExpired = this.isTokenExpired(token);
        if (isExpired) { localStorage.removeItem('flexToken'); }
        return token !== null && !isExpired;
    }

    getToken (): string {
        return localStorage.getItem('flexToken');
    }

    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);
        // console.log(decoded);
        if (decoded.exp === undefined) { return null; }
        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    isTokenExpired(token?: string): boolean {
        if (!token) { token = this.getToken(); }
        if (!token) { return true; }

        const date = this.getTokenExpirationDate(token);
        if (date === undefined) { return false; }
        return !(date.valueOf() > new Date().valueOf());
    }

    getCurrentUser (): UserInfo {
        return jwt_decode(this.getToken());
    }

    GetVersion (): string {
        return '0.1.1';
    }

    GetMenu (): Observable<NavData[]> {
        return this.http.post<NavData[]>(this.baseUrl + 'GetMenu', {
            UserCd: this.getCurrentUser().USER_CD,
            Password: null,
        });
    }

    GetDataToLocal (): boolean {

        this.GetMessage().subscribe(res => {
            localStorage.setItem('flexMessage', JSON.stringify(res));
        });
        this.GetScreenDetail().subscribe(scn => {
            localStorage.setItem('flexScreenDetail', JSON.stringify(scn));
        });
        this.GetActivePermission().subscribe(res => {
            localStorage.setItem('flexPermission', JSON.stringify(res));
        });
        return true;
    }

    GetMessage (): Observable<TZ_MESSAGE_MS[]> {
        return this.http.post<TZ_MESSAGE_MS[]>(this.baseUrl + 'GetMessage', {
            LangCd: this.getCurrentUser().LANG_CD,
        });
    }

    GetMessageObj (MSG_CD: string): TZ_MESSAGE_MS {
        const msg: TZ_MESSAGE_MS[] = JSON.parse(localStorage.getItem('flexMessage'));
        return msg.find(function(item) {
            return item.MSG_CD === MSG_CD;
        });
    }

    GetScreenDetailObj (CONTROL_CD: string): TZ_SCREEN_DETAIL_LANG_MS {
        const scn = this.GetScreenObj();
        const msg: TZ_SCREEN_DETAIL_LANG_MS[] = JSON.parse(localStorage.getItem('flexScreenDetail'));
        return msg.find(function(item) {
            return item.CONTROL_CD === CONTROL_CD && item.SCREEN_CD === scn.ScreenCd;
        });
    }

    GetScreenDetail (): Observable<TZ_SCREEN_DETAIL_LANG_MS[]> {
        return this.http.post<TZ_SCREEN_DETAIL_LANG_MS[]>(this.baseUrl + 'GetScreenDetail', {
            LangCd: this.getCurrentUser().LANG_CD,
        });
    }

    InsertScreenDetail (data: TZ_SCREEN_DETAIL_LANG_MS) {
        const tbs: TZ_SCREEN_DETAIL_LANG_MS[] = [];
        tbs.push(data);
        this.http.post(this.baseUrl + 'InsertScreenDetail', tbs).subscribe(res => {
            console.log(res);
        }, error => {
            console.log(error);
        });
    }

    GetScreenDetailDesc (): TZ_SCREEN_DETAIL_LANG_MS {
        const scn = this.GetScreenObj();
        const text: TZ_SCREEN_DETAIL_LANG_MS[] = JSON.parse(localStorage.getItem('flexScreenDetail'));
        const lbl: TZ_SCREEN_DETAIL_LANG_MS = new TZ_SCREEN_DETAIL_LANG_MS;
        text.forEach(function(e) {
            if (e.SCREEN_CD === scn.ScreenCd) {
                lbl[e.CONTROL_CD] = e.CONTROL_CAPTION;
            }
        });
        return lbl;
    }
    GetScreenDetailDescByCode (ScreenCd: string): any[] {
        const text: TZ_SCREEN_DETAIL_LANG_MS[] = JSON.parse(localStorage.getItem('flexScreenDetail'));
        const lbl = [];
        text.forEach(function(e) {
            if (e.SCREEN_CD === ScreenCd) {
                lbl[e.CONTROL_CD] = e.CONTROL_CAPTION;
            }
        });
        return lbl;
    }

    GetScreenObj (): NavData {
        const url = this.router.url;
        const menus: NavData[] = JSON.parse(localStorage.getItem('flexMenu'));
        const child: NavData[] = [];
        menus.forEach(function(e) {
            if (e.children) {
                e.children.forEach(function(c) {
                    child.push(c);
                });
            }
        });
        const obj = child.find(function(e) {
            return e.url === url;
        });
        return obj;
    }

    GetUserProfile (): Observable<TZ_USER_MS> {
        return this.http.post<TZ_USER_MS>(this.baseUrl + 'GetUserProfile', { UserCd: this.getCurrentUser().USER_CD });
    }

    GetNotiy (): Observable<Notify[]> {
        return this.http.post<Notify[]>(this.baseUrl + 'GetNotify', { UserCd: this.getCurrentUser().USER_CD });
    }

    ResponseNotify (noti: Notify): Observable<boolean> {
        return this.http.post<boolean>(this.baseUrl + 'ResponseNotify', noti);
    }

    private GetActivePermission (): Observable<ActivePermissionValue[]> {
        const userGroup: string = this.getCurrentUser().GROUP_CD;
        return this.http.get<ActivePermissionValue[]>(this.baseUrl + 'GetActivePermission/' + userGroup);
    }

    ActivePermission(ScreenCd: string = null): ActivePermissionValue {
        if (!ScreenCd) {
            ScreenCd = this.GetScreenObj().ScreenCd;
        }
        const P: ActivePermissionValue[] = JSON.parse(localStorage.getItem('flexPermission'));
        return P.find(function(value) {
            return value.SCREEN_CD === ScreenCd;
        });
    }
}
