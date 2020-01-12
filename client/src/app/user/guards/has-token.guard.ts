import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable, of} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {select, Store} from "@ngrx/store";
import * as fromAuth from '../../user/state/user.reducer'
import {FetchUserDetailsAction} from "../state/user.actions";

@Injectable()
export class HasTokenGuard implements CanActivate {

  private readonly apiToken: string = "api_token";
  isAuthenticated: boolean;

  constructor(
    private cookieService: CookieService,
    private store: Store<fromAuth.UserInfoState>,
    private router: Router
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.isAuthenticated = false;
    if (state && state.url && this.cookieService.check(this.apiToken)) {
      if (state.url === '/home' || state.url === '/manage') {
        this.store.pipe(select(fromAuth.isFullyAuthenticated)).subscribe(
          (data) => {
            if (data) {
              this.isAuthenticated = true;
            } else {
              this.store.dispatch(new FetchUserDetailsAction());
              this.store.pipe(select(fromAuth.isFullyAuthenticated)).subscribe(
                data => {
                  if (data) {
                    this.isAuthenticated = true;
                  }
                }
              );
            }
          }
        )
      }
    }
    if (!this.isAuthenticated) {
      this.router.navigate(["/login"]);
    }
    return of(this.isAuthenticated);
  }

}
