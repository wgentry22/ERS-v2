import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {select, Store} from "@ngrx/store";
import * as fromAuth from '../../user/state/user.reducer'

@Injectable()
export class IsManagerGuard implements CanActivate {

  constructor(
    private store: Store<fromAuth.UserInfoState>,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let isManager: boolean = false;
    this.store.pipe(select(fromAuth.currentUserInfoState)).subscribe(
      data => {
        if (data) {
          isManager = data.position && data.position === 'Manager';
        }
      }
    );
    if (!isManager) {
      this.router.navigate(["/home"]);
    }
    return of(isManager);
  }

}
