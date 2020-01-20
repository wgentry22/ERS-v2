import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '../../user/state/user.reducer';
import {FetchUserDetailsAction} from '../state/user.actions';
import {SecurityService} from '../services/security.service';

@Injectable()
export class HasTokenGuard implements CanActivate {

  private readonly apiToken: string = 'api_token';
  isAuthenticated: boolean;

  constructor(
    private cookieService: CookieService,
    private store: Store<fromAuth.UserInfoState>,
    private router: Router,
    private securityService: SecurityService
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.isAuthenticated = false;
    if (state && state.url && this.cookieService.check(this.apiToken)) {
      if (state.url.includes('/home') || state.url.includes('/home/manage')) {
        this.store.pipe(select(fromAuth.currentUserInfoState)).subscribe(
          info => {
            if (Object.keys(info).length > 0) {
              this.isAuthenticated = this.securityService.isValid(info);
            } else {
              // Attempt to refresh UserInfoState if cookie is available but not in store
              this.store.dispatch(new FetchUserDetailsAction());
              this.store.pipe(select(fromAuth.currentUserInfoState)).subscribe(
                fromCookie => {
                  this.isAuthenticated = this.securityService.isValid(fromCookie);
                }
              );
            }
          }
        );
        // this.store.pipe(select(fromAuth.isFullyAuthenticated)).subscribe(
        //   (data) => {
        //     if (data) {
        //       this.isAuthenticated = true;
        //     } else {
        //       this.store.dispatch(new FetchUserDetailsAction());
        //       this.store.pipe(select(fromAuth.isFullyAuthenticated)).subscribe(
        //         retry => {
        //           if (retry) {
        //             this.isAuthenticated = true;
        //           }
        //         }
        //       );
        //     }
        //   }
        // );
      }
    }
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    }
    return of(this.isAuthenticated);
  }

}
