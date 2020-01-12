import {Actions, Effect, ofType} from "@ngrx/effects";
import {RegistrationService} from "../services/registration.service";
import {Observable, of} from "rxjs";
import {Action} from "@ngrx/store";
import * as fromManager from "./registration.actions";
import {catchError, concatMap, map} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Message} from "../../domain/dto/message.dto";
import {AuthenticationFailureAction} from "../../user/state/user.actions";
import {CheckUsernameAvailabilityAction} from "./registration.actions";
import {Injectable} from "@angular/core";

@Injectable()
export class RegistrationEffects {

  constructor(
    private actions$: Actions,
    private registrationService: RegistrationService
  ) {}

  @Effect()
  attemptRegistration$: Observable<Action> = this.actions$.pipe(
    ofType(fromManager.RegistrationActionTypes.ATTEMPT_REGISTRATION),
    concatMap((action: fromManager.AttemptRegistrationAction) => {
      return this.registrationService.attemptRegistration(action.form).pipe(
        map((msg: Message) => new fromManager.RegistrationSuccessAction(msg)),
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
  isUsernameAvailable$: Observable<Action> = this.actions$.pipe(
    ofType(fromManager.RegistrationActionTypes.CHECK_USERNAME_AVAILABILITY),
    concatMap((action: CheckUsernameAvailabilityAction) => {
      return this.registrationService.checkUsernameAvailability(action.username).pipe(
        map(resp => new fromManager.UsernameAvailableAction()),
        catchError(err => of(new fromManager.UsernameIsNotAvailableAction()))
      )
    })
  )
}
