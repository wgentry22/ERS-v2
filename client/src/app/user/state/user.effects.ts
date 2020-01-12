import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {AuthService} from "../services/auth.service";
import {Observable, of} from "rxjs";
import {Action} from "@ngrx/store";
import {
  AttemptAuthenticationAction,
  AuthenticationFailureAction,
  AuthenticationSuccessAction,
  UserActionTypes
} from "./user.actions";
import {catchError, exhaustMap, map} from "rxjs/operators";
import {UserInfoState} from "./user.reducer";
import {HttpErrorResponse} from "@angular/common/http";
import {Message} from "../../domain/dto/message.dto";
import {Router} from "@angular/router";

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  @Effect()
  attemptAuthentication$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionTypes.ATTEMPT_AUTHENTICATION),
    exhaustMap((action: AttemptAuthenticationAction) => {
      return this.authService.attemptAuthentication(action.payload).pipe(
        map((details: UserInfoState) => (new AuthenticationSuccessAction(details))),
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            const message: Message = err.error;
            return of(new AuthenticationFailureAction(message));
          }
        })
      )
    })
  );

  @Effect()
  fetchUserInfoState$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionTypes.FETCH_USER_INFO),
    exhaustMap(action => {
      return this.authService.fetchUserInfoState().pipe(
        map((details: UserInfoState) => {
          this.router.navigate(["/home"], );
          return new AuthenticationSuccessAction(details);
        }),
        catchError(err => of(new AuthenticationFailureAction(err.error)))
      )
    })
  );

}
