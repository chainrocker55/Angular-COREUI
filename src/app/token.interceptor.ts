import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlexService } from './Flex/Flex/services/flex.service';

/**
 * TokenInterceptor
 * @see https://angular.io/guide/http#intercepting-all-requests-or-responses
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private flexService: FlexService;
    private token: string;

    constructor(private injector: Injector) {
    }

    // public getToken(): string {
    //     return localStorage.getItem('auth_app_token');
    // }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // this.tokenService = this.injector.get(NbAuthJWTToken);
        this.flexService = this.injector.get(FlexService); // get it here within intercept

        if (this.flexService.isAuthenticated()) {
            this.token = this.flexService.getToken();
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
        }

        return next.handle(request);
    }
}
