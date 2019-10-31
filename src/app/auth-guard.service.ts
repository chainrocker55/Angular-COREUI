import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { FlexService } from './Flex/Flex/services/flex.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private Version: string =  environment.appVersion;

  constructor(private router: Router, private flexService: FlexService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.flexService.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    } else if (this.flexService.GetVersion() !== this.Version) {
      // location.reload(true);
      this.router.navigate(['login']);
      return false;
    } else if (localStorage.getItem('flexMenu') !== null && localStorage.getItem('flexMenu').indexOf(state.url) < 0) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
