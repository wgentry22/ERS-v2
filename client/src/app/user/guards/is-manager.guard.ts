import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '../../user/state/user.reducer';
import {SecurityService} from "../services/security.service";

@Injectable()
export class IsManagerGuard implements CanActivate {

  constructor(
    private store: Store<fromAuth.UserInfoState>,
    private router: Router,
    private securityService: SecurityService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let isManager = false;
    this.store.pipe(select(fromAuth.currentUserInfoState)).subscribe(
      data => {
        if (data) {
          isManager = this.securityService.isManagerReachable(data);
        }
      }
    );
    if (!isManager) {
      this.router.navigate(['/home']);
    }
    return of(isManager);
  }

}
