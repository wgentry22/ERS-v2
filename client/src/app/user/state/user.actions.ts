import {LoginFormDto} from "../../domain/dto/login-form.dto";
import {Action} from "@ngrx/store";
import {Message} from "../../domain/dto/message.dto";
import {UserInfoState} from "./user.reducer";

export enum UserActionTypes {
  ATTEMPT_AUTHENTICATION = "[User] Attempt Authentication",
  FETCH_USER_INFO = '[User] Fetch User Info',
  AUTHENTICATION_SUCCESS = "[User] Authentication Success",
  AUTHENTICATION_FAILURE = "[User] Authentication Failure",
  CLEAR_USER_INFO = '[User] Clear User Info'
}

export class AttemptAuthenticationAction implements Action {
  readonly type = UserActionTypes.ATTEMPT_AUTHENTICATION;

  constructor(public payload: LoginFormDto) {}
}

export class AuthenticationSuccessAction implements Action {
  readonly type = UserActionTypes.AUTHENTICATION_SUCCESS;

  constructor(public details: UserInfoState) {}
}

export class AuthenticationFailureAction implements Action {
  readonly type = UserActionTypes.AUTHENTICATION_FAILURE;

  constructor(public message: Message) {}
}

export class FetchUserDetailsAction implements Action {
  readonly type = UserActionTypes.FETCH_USER_INFO;

  constructor() {}
}

export class ClearUserDetailsAction implements Action {
  readonly type = UserActionTypes.CLEAR_USER_INFO;

  constructor() {}
}

export type UserActions = AttemptAuthenticationAction |
  AuthenticationSuccessAction |
  AuthenticationFailureAction |
  FetchUserDetailsAction |
  ClearUserDetailsAction;
